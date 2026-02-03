import { updateAdvanced, updateSpec } from 'src/builder/register/custom'
import { Builder } from 'src/builder'

test('custom pipe registration', () => {
    const mockAdvancedPipe = () => ({});
    const mockSpecPipe = () => ({});

    // Mock existing pipelines to avoid undefined errors when getXXXPipeline pushes to them
    const mockAdvancedPipeline = [] as any[];
    const mockSpecPipeline = [] as any[];
    Builder.registerAdvancedPipeline('bar', mockAdvancedPipeline);
    Builder.registerSpecPipeline('bar', mockSpecPipeline);

    updateAdvanced('bar', mockAdvancedPipe);
    // Verify using public static method
    const advancedPipeline = Builder.getAdvancedPipeline('bar');
    expect(advancedPipeline).toContain(mockAdvancedPipe);

    updateSpec('bar', mockSpecPipe);
    // Verify using public static method
    const specPipeline = Builder.getSpecPipeline('bar');
    expect(specPipeline).toContain(mockSpecPipe);
});
