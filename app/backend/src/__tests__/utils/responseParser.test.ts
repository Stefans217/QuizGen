import { parseAiResponse } from '../../../src/utils/responseParser';

describe('parseAiResponse', () => {
  test('should parse manifest and question when both are present', () => {
    const input = `<manifest>Manifest content</manifest>
                    ---
                    <assessmentItem>Question content</assessmentItem>`;
    const result = parseAiResponse(input);
    expect(result.manifest).toBe('<manifest>Manifest content</manifest>');
    expect(result.questions).toEqual(['<assessmentItem>Question content</assessmentItem>']);
  });

  test('should remove markdown formatting and parse values', () => {
    const input = `\n<manifest>Manifest content</manifest>\n 
                    --- 
                    \n<assessmentItem>Question 1</assessmentItem>\n`;
    const result = parseAiResponse(input);
    expect(result.manifest).toBe('<manifest>Manifest content</manifest>');
    expect(result.questions).toEqual(['<assessmentItem>Question 1</assessmentItem>']);
  });

  test('should default to first chunk as manifest if no explicit manifest is found', () => {
    const input = `<assessmentItem>Question 1</assessmentItem>
                    ---
                    <assessmentItem>Question 2</assessmentItem>`;
    const result = parseAiResponse(input);
    expect(result.manifest).toBe('<assessmentItem>Question 1</assessmentItem>');
    expect(result.questions).toEqual(['<assessmentItem>Question 2</assessmentItem>']);
  });

  test('should filter out invalid question chunks', () => {
    const input = `<manifest>Manifest content</manifest>
                    ---
                    <item>Not a valid question</item>
                    ---
                    <assessmentItem>Valid Question</assessmentItem>`;
    const result = parseAiResponse(input);
    expect(result.manifest).toBe('<manifest>Manifest content</manifest>');
    expect(result.questions).toEqual(['<assessmentItem>Valid Question</assessmentItem>']);
  });
});