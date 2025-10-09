import { experimental_AstroContainer } from 'astro/container';
import { h } from 'react'; // or 'react' if you're using React

export async function renderAstroComponent(Component: any, props: Record<string, any>) {
    const container = await experimental_AstroContainer.create();
    const html = await container.renderToString(h(Component, props));
    const dom = new DOMParser().parseFromString(html, 'text/html');
    return dom.body;
}
