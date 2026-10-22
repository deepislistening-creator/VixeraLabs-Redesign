import type { ImageMetadata } from 'astro';

export interface Article {
	// URL segment: the post lives at /insights/<slug>
	slug: string;
	category: string;
	title: string;
	excerpt: string;
	readTime: string;
	image?: ImageMetadata;
	alt?: string;
	// Shown until an image is added, and behind it while it loads
	placeholder: string;
}

export const articles: Article[] = [
	{
		slug: 'custom-software-development-for-startups',
		category: 'Startups',
		title: 'Custom Software Development for Startups',
		excerpt:
			"Custom software can set your startup apart or drain your runway before you find customers. The difference is rarely the code; it's the decisions around it.",
		readTime: '5 min read',
		placeholder: 'linear-gradient(160deg, #e3fddb 0%, #96f878 55%, #3ddc6b 100%)',
	},
	{
		slug: 'app-development-cost',
		category: 'App development',
		title: 'How Much Does App Development Cost in 2026?',
		excerpt:
			'Real budget ranges: a simple app runs $15,000–$50,000, a mid-complexity app $50,000–$150,000, and a complex app $150,000–$400,000+.',
		readTime: '5 min read',
		placeholder: 'linear-gradient(160deg, #1d5a32 0%, #0c2b15 100%)',
	},
	{
		slug: 'what-is-an-mvp',
		category: 'MVP development',
		title: 'What Is an MVP in Software Development?',
		excerpt:
			"The simplest version of a product that still delivers real value to users. Here's what that means in practice, and how the build actually works.",
		readTime: '4 min read',
		placeholder: 'linear-gradient(160deg, #0a0a0a 0%, #0c2b15 60%, #3ddc6b 140%)',
	},
	{
		slug: 'saas-development-cost-and-process',
		category: 'SaaS development',
		title: 'SaaS Development Cost & Process',
		excerpt:
			'Planning a SaaS product? A straight answer to what it costs and how the development process works, with real budget ranges by stage.',
		readTime: '5 min read',
		placeholder: 'linear-gradient(160deg, #2f7a45 0%, #0c2b15 100%)',
	},
	{
		slug: 'ai-automation-examples',
		category: 'AI automation',
		title: '10 Real AI Automation Examples That Cut Costs',
		excerpt:
			'Agents doing real work inside real businesses, organised by the team they help, plus how orchestration ties them into end-to-end workflows.',
		readTime: '6 min read',
		placeholder: 'linear-gradient(160deg, #96f878 0%, #2f7a45 50%, #0c2b15 100%)',
	},
];
