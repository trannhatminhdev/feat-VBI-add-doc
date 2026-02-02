import { updateAdvanced, updateSpec } from 'src/builder/register/custom'
import { Builder } from 'src/builder'

test('custom pipe registration', () => {
    const mockAdvancedPipe = () => ({});
    const mockSpecPipe = () => ({});

    updateAdvanced('bar', mockAdvancedPipe);
    expect(Builder._customAdvancedPipe['bar']).toBe(mockAdvancedPipe);

    updateSpec('bar', mockSpecPipe);
    expect(Builder._customSpecPipe['bar']).toBe(mockSpecPipe);
});
