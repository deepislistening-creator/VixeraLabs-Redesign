// Single source for the four services: the Services page cards, the navbar dropdown
// and the individual /services/<slug> pages all read from here.

export interface ServiceRow {
	label: string;
	status: string;
}

export interface Service {
	slug: string;
	name: string;
	// One-line summary, shown in the navbar dropdown
	short: string;
	headline: string;
	description: string;
	features: string[];
	// Visual on the card: a mock "automation feed" over a gradient
	visual: {
		gradient: string;
		title: string;
		rows: ServiceRow[];
		metric: { value: string; label: string };
	};
}

export const services: Service[] = [
	{
		slug: 'founder-os',
		name: 'Founder OS',
		short: 'Your inbox, calendar and admin, on autopilot.',
		headline: 'Get your hours back from the busywork.',
		description:
			'An AI operating layer for founders. It triages your inbox, preps every meeting, chases follow-ups and rolls your numbers into one weekly brief, so you spend your time on decisions, not admin.',
		features: [
			'Inbox triage and drafted replies',
			'Meeting prep and follow-up notes',
			'Weekly founder brief from your tools',
			'Task capture across Slack and email',
		],
		visual: {
			gradient: 'linear-gradient(150deg, #1d5a32 0%, #0c2b15 70%)',
			title: 'Today, handled',
			rows: [
				{ label: '42 emails triaged', status: 'Done' },
				{ label: 'Investor call prep', status: 'Ready' },
				{ label: '6 follow-ups drafted', status: 'Review' },
				{ label: 'Weekly brief', status: 'Friday' },
			],
			metric: { value: '12h', label: 'saved per week' },
		},
	},
	{
		slug: 'brand-os',
		name: 'Brand OS',
		short: 'A content engine that sounds like you.',
		headline: 'Show up everywhere, in your own voice.',
		description:
			'A content system trained on your brand voice. It turns one idea into posts, newsletters and scripts, schedules them across channels and reports on what lands, so your brand stays consistent without a full team.',
		features: [
			'Brand voice trained on your content',
			'One idea repurposed across channels',
			'Content calendar and auto-scheduling',
			'Performance reports every week',
		],
		visual: {
			gradient: 'linear-gradient(150deg, #2f7a45 0%, #0c2b15 75%)',
			title: 'This week’s content',
			rows: [
				{ label: 'LinkedIn post × 3', status: 'Scheduled' },
				{ label: 'Newsletter draft', status: 'Review' },
				{ label: 'Short video scripts', status: 'Ready' },
				{ label: 'X thread', status: 'Scheduled' },
			],
			metric: { value: '5×', label: 'more output' },
		},
	},
	{
		slug: 'outreach-os',
		name: 'Outreach OS',
		short: 'Pipeline that fills itself.',
		headline: 'Turn cold lists into booked calls.',
		description:
			'An outbound engine that finds the right accounts, enriches every lead, writes personalised sequences and keeps your CRM in sync, so your team only talks to people who are ready to buy.',
		features: [
			'Lead sourcing and enrichment',
			'Personalised multi-step sequences',
			'Reply detection and routing',
			'Automatic CRM updates',
		],
		visual: {
			gradient: 'linear-gradient(150deg, #0a0a0a 0%, #0c2b15 60%, #1d5a32 120%)',
			title: 'Pipeline today',
			rows: [
				{ label: '320 leads enriched', status: 'Done' },
				{ label: 'Sequence A, step 2', status: 'Sending' },
				{ label: '14 positive replies', status: 'Routed' },
				{ label: 'CRM sync', status: 'Live' },
			],
			metric: { value: '3×', label: 'more meetings' },
		},
	},
	{
		slug: 'custom-os',
		name: 'Custom OS',
		short: 'Bespoke AI systems for your workflows.',
		headline: 'Built around how your business actually runs.',
		description:
			'When off-the-shelf won’t cut it, we design and build an AI system around your exact processes and stack, from operations and finance to support, and stay with you long after launch.',
		features: [
			'Workflow audit and automation map',
			'Integrations with your existing stack',
			'Custom AI agents and dashboards',
			'Ongoing support and iteration',
		],
		visual: {
			gradient: 'linear-gradient(150deg, #3ddc6b -40%, #1d5a32 30%, #0c2b15 85%)',
			title: 'Your system',
			rows: [
				{ label: 'Invoices processed', status: 'Live' },
				{ label: 'Support tickets tagged', status: 'Live' },
				{ label: 'Ops dashboard', status: 'Synced' },
				{ label: 'New agent', status: 'Building' },
			],
			metric: { value: '100%', label: 'built for you' },
		},
	},
];
