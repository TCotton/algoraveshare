import { expect, test, describe, it } from 'vitest';
import { renderAstroComponent } from '../../test-utils.js';
import MyComponent from '../../../components/Icon.astro';

describe('Icon.astro', () => {
    it('renders correctly', async () => {
        const container = await renderAstroComponent(MyComponent);
        expect(container.querySelector('h1')).toHaveTextContent('algorave share');
    });
})
