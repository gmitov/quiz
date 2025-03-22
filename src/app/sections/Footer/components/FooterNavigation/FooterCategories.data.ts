export type NavigationItemType = {
    id: string;
    name: string;
    url: string;
};

type FooterNavSection = {
    id: string;
    header: string;
    items: NavigationItemType[];
};

export const ProductSection: FooterNavSection = {
    id: 'product',
    header: 'product',
    items: [
        { id: 'popular', name: 'popular', url: '/popular' },
        { id: 'trending', name: 'trending', url: 'trending' },
        { id: 'guided', name: 'guided', url: '/guided' },
        { id: 'products', name: 'products', url: '/products' },
    ],
};

export const CompanySection: FooterNavSection = {
    id: 'company',
    header: 'company',
    items: [
        { id: 'press', name: 'press', url: '/press' },
        { id: 'mission', name: 'mission', url: 'mission' },
        { id: 'strategy', name: 'strategy', url: '/strategy' },
        { id: 'about', name: 'about', url: '/about' },
    ],
};

export const InfoSection: FooterNavSection = {
    id: 'info',
    header: 'info',
    items: [
        { id: 'support', name: 'support', url: '/support' },
        { id: 'customer-service', name: 'customer service', url: '/customer-service' },
        { id: 'get-started', name: 'get started', url: '/get-started' },
    ],
};
