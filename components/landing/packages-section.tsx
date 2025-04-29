import { X } from 'lucide-react';
import { Check } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { dataPackages, IPackage } from './dataPackages';

function Feature({
  children,
  included = false,
}: {
  children: React.ReactNode;
  included?: boolean;
}) {
  return (
    <li className="flex items-center">
      {included ? (
        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
      )}
      <span className="text-foreground">{children}</span>
    </li>
  );
}

const PackagesSection = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          CONTAMOS CON 3 PAQUETES:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dataPackages.map((packageItem: IPackage) => (
            <div
              key={packageItem.id}
              className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-foreground">{packageItem.name}</h3>
                <div className="flex items-center justify-center my-4">
                  <span className="text-4xl font-bold text-red-600">${packageItem.price}</span>
                  <span className="ml-1 text-foreground">PESOS</span>
                </div>
                <ul className="space-y-3 text-left mb-6">
                  {packageItem.features.map((feature: { name: string; included: boolean }) => (
                    <Feature key={feature.name} included={feature.included}>
                      {feature.name}
                    </Feature>
                  ))}
                </ul>
                <div className="space-y-2">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    Ver Demo XV
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ver Demo BODA
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
