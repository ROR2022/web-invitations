export interface IPackage {
    id: string;
    name: string;
    price: number;
    features: {
        name: string;
        included: boolean;
    }[];
}

export const dataPackages: IPackage[] = [
    {
        id: 'basic',
        name: 'Básica',
        price: 299,
        features: [
            { name: 'Cuenta regresiva', included: true },
            { name: 'Cuándo y dónde', included: true },
            { name: 'Confirmación de asistencia', included: true },
            { name: 'Opciones de regalo', included: true },
            { name: 'Código de vestimenta', included: true },
            { name: 'Música personalizada', included: false },
            { name: 'Galería', included: false },
            { name: 'Padrinos', included: false },
            { name: 'Hospedaje', included: false },
            { name: 'Itinerario', included: false },
            { name: 'Pases invitados (5)', included: false }
        ]
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 499,
        features: [
            { name: 'Cuenta regresiva', included: true },
            { name: 'Cuándo y dónde', included: true },
            { name: 'Confirmación de asistencia', included: true },
            { name: 'Opciones de regalo', included: true },
            { name: 'Código de vestimenta', included: true },
            { name: 'Música personalizada', included: true },
            { name: 'Galería', included: true },
            { name: 'Padrinos', included: true },
            { name: 'Hospedaje', included: false },
            { name: 'Itinerario', included: false },
            { name: 'Pases invitados (5)', included: false }
        ]
    },
    {
        id: 'vip',
        name: 'VIP',
        price: 699,
        features: [
            { name: 'Cuenta regresiva', included: true },
            { name: 'Cuándo y dónde', included: true },
            { name: 'Confirmación de asistencia', included: true },
            { name: 'Opciones de regalo', included: true },
            { name: 'Código de vestimenta', included: true },
            { name: 'Música personalizada', included: true },
            { name: 'Galería', included: true },
            { name: 'Padrinos', included: true },
            { name: 'Hospedaje', included: true },
            { name: 'Itinerario', included: true },
            { name: 'Pases invitados (5)', included: true }
        ]
    }
]