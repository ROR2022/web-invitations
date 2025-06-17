module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Desactivar regla prop-types para archivos TypeScript
    'react/prop-types': 'off',
    
    // Configurar regla exhaustive-deps para ser más flexible
    'react-hooks/exhaustive-deps': 'warn'
  },
  overrides: [
    {
      // Configuración especial para archivos TypeScript
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        // Reglas específicas para TypeScript pueden ir aquí
      },
      excludedFiles: ['components/template-editor/mobile/mobile-component-registry.tsx']
    }
  ]
};
