import type { Ref } from 'vue'

import { describe, expect, it } from 'bun:test'

import {
	type MarkdownAiProvider,
	type UseCopyOrDownloadAsMarkdownButtonsOptions,
	type UseCopyOrDownloadAsMarkdownButtonsReturn,
	type defaultAiProviders,
	useCopyOrDownloadAsMarkdownButtons,
} from '@/vitepress-components/composables/copy-or-download-as-markdown-buttons'

type Assert<T extends true> = T

type IsEqual<Left, Right> = [Left] extends [Right] ? ([Right] extends [Left] ? true : false) : false

const customAiProviders = [
	{ name: 'Gemini', url: 'https://gemini.google.com/app?q=' },
	{ name: 'Perplexity', url: 'https://www.perplexity.ai/?q=' },
] as const satisfies readonly MarkdownAiProvider[]

const dynamicAiProviders: readonly MarkdownAiProvider[] = [
	{ name: 'Gemini', url: 'https://gemini.google.com/app?q=' },
]

const useDefaultButtons: () => UseCopyOrDownloadAsMarkdownButtonsReturn = useCopyOrDownloadAsMarkdownButtons
const useCustomButtons = useCopyOrDownloadAsMarkdownButtons<typeof customAiProviders>
const useDynamicButtons = useCopyOrDownloadAsMarkdownButtons<typeof dynamicAiProviders>

type DefaultAiProviders = ReturnType<typeof useDefaultButtons>['aiProviders']
type CustomAiProviders = ReturnType<typeof useCustomButtons>['aiProviders']
type DynamicOpenInAIProvider = Parameters<ReturnType<typeof useDynamicButtons>['openInAI']>[0]
type CustomOpenInAIProvider = Parameters<ReturnType<typeof useCustomButtons>['openInAI']>[0]
type CustomCurrentURL = ReturnType<typeof useCustomButtons>['currentURL']
type CustomMarkdownPageURL = ReturnType<typeof useCustomButtons>['markdownPageURL']
type ExportedCustomOptions = UseCopyOrDownloadAsMarkdownButtonsOptions<typeof customAiProviders>
type ExportedCustomReturn = UseCopyOrDownloadAsMarkdownButtonsReturn<typeof customAiProviders>

const compileTimeAssertions = {
	customAiProvidersArePreserved: true as Assert<IsEqual<CustomAiProviders, typeof customAiProviders>>,
	customOpenInAIProviderMatchesInput: true as Assert<
		IsEqual<CustomOpenInAIProvider, (typeof customAiProviders)[number]>
	>,
	defaultAiProvidersArePreserved: true as Assert<IsEqual<DefaultAiProviders, typeof defaultAiProviders>>,
	dynamicOpenInAIProviderFallsBackToBaseType: true as Assert<
		IsEqual<DynamicOpenInAIProvider, MarkdownAiProvider>
	>,
	exportedOptionsKeepCustomProviders: true as Assert<
		IsEqual<NonNullable<ExportedCustomOptions['aiProviders']>, typeof customAiProviders>
	>,
	exportedReturnExposesReadonlyCurrentURL: true as Assert<IsEqual<CustomCurrentURL, Readonly<Ref<string>>>>,
	exportedReturnExposesReadonlyMarkdownPageURL: true as Assert<
		IsEqual<CustomMarkdownPageURL, Readonly<Ref<string>>>
	>,
	exportedReturnKeepsCustomOpenInAIProvider: true as Assert<
		IsEqual<Parameters<ExportedCustomReturn['openInAI']>[0], Readonly<(typeof customAiProviders)[number]>>
	>,
}

describe('copy-or-download-as-markdown-buttons typings', () => {
	it('keeps compile-time provider inference coverage', () => {
		expect(compileTimeAssertions.defaultAiProvidersArePreserved).toBeTrue()
		expect(compileTimeAssertions.customAiProvidersArePreserved).toBeTrue()
		expect(compileTimeAssertions.customOpenInAIProviderMatchesInput).toBeTrue()
		expect(compileTimeAssertions.dynamicOpenInAIProviderFallsBackToBaseType).toBeTrue()
		expect(compileTimeAssertions.exportedOptionsKeepCustomProviders).toBeTrue()
		expect(compileTimeAssertions.exportedReturnExposesReadonlyCurrentURL).toBeTrue()
		expect(compileTimeAssertions.exportedReturnExposesReadonlyMarkdownPageURL).toBeTrue()
		expect(compileTimeAssertions.exportedReturnKeepsCustomOpenInAIProvider).toBeTrue()
		expect(customAiProviders).toHaveLength(2)
		expect(dynamicAiProviders).toHaveLength(1)
	})
})
