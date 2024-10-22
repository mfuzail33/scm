// assets
import { ShoppingBag, Heart, Book } from 'iconsax-react';

// icons
const icons = {
    ShoppingBag, Heart, Book
};

let children = [];

children = [
    {
        id: 'health',
        title: 'Health Care',
        type: 'item',
        url: '/health',
        icon: icons.Heart,
        breadcrumbs: false
    },
    {
        id: 'mall',
        title: 'Shopping Mall',
        type: 'item',
        url: '/mall',
        icon: icons.ShoppingBag,
        breadcrumbs: false
    },
    {
        id: 'education',
        title: 'Educational Institutes',
        type: 'item',
        url: '/education',
        icon: icons.Book,
        breadcrumbs: false
    },
]
const tabs = {
    id: 'group-tabs',
    title: '',
    icon: icons.tabs,
    type: 'group',
    children
};

export default tabs;
