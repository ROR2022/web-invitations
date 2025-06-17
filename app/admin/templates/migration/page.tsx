"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  FileWarning,
  Database as DatabaseIcon
} from 'lucide-react';
import type { Database } from '@/types/supabase';
import { findTemplatesWithoutConfigSQL, createBatchMigrationSQL } from '@/utils/templateMigration';

interface Template {
  id: string;
  name: string;
  description: string | null;
  html: string | null;
  css: string | null;
  js: string | null;
  config: any | null;
  has_html: boolean;
  has_css: boolean;
  has_js: boolean;
  has_config: boolean;
}

const TemplateMigrationPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState<{
    success: string[];
    failed: string[];
    skipped: string[];
  }>({
    success: [],
    failed: [],
    skipped: []
  });
  const [isMigrationComplete, setIsMigrationComplete] = useState(false);
  
  const supabase = createClientComponentClient<Database>();
  
  // Fetch templates that need migration
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    
    try {
      // Get all templates with legacy fields
      const { data, error } = await supabase
        .from('templates')
        .select('id, name, description, html, css, js, config')
        .or('html.neq.null,css.neq.null,js.neq.null');
      
      if (error) throw error;
      
      // Process templates to add flags for what they have
      const processedTemplates = data.map(template => ({
        ...template,
        has_html: !!template.html,
        has_css: !!template.css,
        has_js: !!template.js,
        has_config: !!template.config && Object.keys(template.config || {}).length > 0
      }));
      
      setTemplates(processedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      alert('Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  // Run batch migration for templates that have config
  const runBatchMigration = async () => {
    setMigrating(true);
    
    try {
      // Get the SQL for batch migration
      const migrationSQL = createBatchMigrationSQL();
      
      // Run the SQL directly
      const { data, error } = await supabase.rpc('exec_sql', {
        query: migrationSQL
      });
      
      if (error) throw error;
      
      // Get count of updated templates
      const updatedCount = data || 0;
      
      // Log success and refresh template list
      console.log(`Migrated ${updatedCount} templates successfully`);
      
      // Record results
      const successTemplates = templates
        .filter(t => t.has_config)
        .map(t => t.id);
      
      const skippedTemplates = templates
        .filter(t => !t.has_config)
        .map(t => t.id);
      
      setResults({
        success: successTemplates,
        failed: [],
        skipped: skippedTemplates
      });
      
      setIsMigrationComplete(true);
      
      // Refresh template list
      fetchTemplates();
    } catch (error) {
      console.error('Error migrating templates:', error);
      alert('Error al migrar plantillas');
    } finally {
      setMigrating(false);
    }
  };
  
  // Find templates that can't be auto-migrated
  const findManualMigrationCandidates = async () => {
    try {
      // Get the SQL to find templates without config
      const findSQL = findTemplatesWithoutConfigSQL();
      
      // Run the SQL directly
      const { data, error } = await supabase.rpc('exec_sql', {
        query: findSQL
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error finding templates needing manual migration:', error);
      return [];
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/admin/templates" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Plantillas
        </Link>
        
        <h1 className="text-2xl font-bold mt-4">Migración de Plantillas</h1>
        <p className="text-gray-600 mt-2">
          Esta herramienta permite migrar las plantillas del formato antiguo (HTML/CSS/JS) al nuevo formato basado solo en la configuración de componentes.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Información de Migración</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-blue-800 font-medium mb-2 flex items-center">
              <DatabaseIcon className="w-5 h-5 mr-2" />
              ¿Qué cambia con esta migración?
            </h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-gray-700">
              <li>Las plantillas ya no almacenarán HTML, CSS y JS generado</li>
              <li>Solo se guardará la configuración de componentes (JSON)</li>
              <li>El renderizado será siempre dinámico con React</li>
              <li>Las actualizaciones a componentes se reflejarán automáticamente</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-yellow-800 font-medium mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Consideraciones importantes
            </h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-gray-700">
              <li>La migración eliminará los campos HTML, CSS y JS</li>
              <li>Solo las plantillas con configuración (campo config) pueden migrarse automáticamente</li>
              <li>Las plantillas sin configuración necesitarán migración manual</li>
              <li>Este proceso no se puede deshacer</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Estado de las Plantillas</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2">Cargando plantillas...</span>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold">{templates.length}</span>
                  <span className="text-sm text-gray-700">Total Plantillas</span>
                </div>
                <div className="bg-green-100 p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold">
                    {templates.filter(t => t.has_config).length}
                  </span>
                  <span className="text-sm text-gray-700">Con Config</span>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold">
                    {templates.filter(t => !t.has_config).length}
                  </span>
                  <span className="text-sm text-gray-700">Sin Config</span>
                </div>
                <div className="bg-red-100 p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold">
                    {templates.filter(t => t.has_html || t.has_css || t.has_js).length}
                  </span>
                  <span className="text-sm text-gray-700">Con HTML/CSS/JS</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      HTML
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CSS
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      JS
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Config
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.map(template => (
                    <tr key={template.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        {template.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {template.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {template.has_html ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Sí
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {template.has_css ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Sí
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {template.has_js ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Sí
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {template.has_config ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Sí
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {isMigrationComplete ? (
                          results.success.includes(template.id) ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" /> Migrada
                            </span>
                          ) : results.failed.includes(template.id) ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Error
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FileWarning className="w-3 h-3 mr-1" /> Requiere migración manual
                            </span>
                          )
                        ) : (
                          template.has_config ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Lista para migrar
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Requiere migración manual
                            </span>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">Acciones de Migración</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Migración automática</h3>
            <p className="text-sm text-gray-700 mb-4">
              Migra todas las plantillas que tienen configuración. Este proceso eliminará los campos HTML, CSS y JS.
            </p>
            
            <button
              onClick={runBatchMigration}
              disabled={migrating || templates.filter(t => t.has_config).length === 0}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                migrating || templates.filter(t => t.has_config).length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {migrating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
                  Migrando...
                </>
              ) : (
                'Migrar plantillas automáticamente'
              )}
            </button>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Plantillas sin configuración</h3>
            <p className="text-sm text-gray-700 mb-4">
              Las plantillas sin configuración necesitan ser recreadas en el editor de plantillas.
            </p>
            
            <Link 
              href="/admin/templates/create" 
              className="px-4 py-2 rounded-md bg-yellow-600 text-white font-medium hover:bg-yellow-700 inline-block"
            >
              Crear nueva plantilla
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateMigrationPage; 