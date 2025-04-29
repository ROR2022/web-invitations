import React from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Check, X } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Comparativa de Características</h2>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Características</TableHead>
                  <TableHead className="text-center text-cyan-500 text-xl">Básica</TableHead>
                  <TableHead className="text-center text-cyan-500 text-xl">Premium</TableHead>
                  <TableHead className="text-center text-cyan-500 text-xl">Vip</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cuenta Regresiva</TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cuándo y dónde</TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Confirmación de asistencia</TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Opciones de regalo</TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Código de vestimenta</TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Música personalizada</TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Galería</TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Padrinos</TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hospedaje</TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Itinerario</TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pases invitados (5)</TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <X className="mx-auto text-red-500" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Check className="mx-auto text-green-500" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
  )
}

export default FeaturesSection