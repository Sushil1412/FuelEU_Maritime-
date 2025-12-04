# Reflection

Building the FuelEU prototype reinforced how powerful AI agents can be when the work is decomposed into architectural “beats.” I asked Cursor Agent for narrowly scoped deliverables (e.g., “generate Express controllers that implement these ports”) and then validated each output via builds, migrations, or manual review. This rhythm kept me in control of the design while offloading the repetitive scaffolding.

## What I learned about using AI agents
- Capture the target architecture (hexagonal layers, ports/adapters) in the prompt; otherwise the agent defaults to monolithic patterns.
- Prisma 7’s new adapter requirement surfaced only after running commands. Human oversight is still essential: the agent doesn’t see runtime errors unless I feed back the logs, so I closed the loop manually.
- Tailwind’s version mismatch highlighted that agents may pick latest releases blindly. Pinning tool versions myself avoided another cascade of fixes.

## Efficiency vs. Manual Coding
- **Boosts**: Multi-file generation (domain models → ports → adapters) took minutes instead of hours, especially for mirrored frontend/backend structures.
- **Costs**: Debugging environment-specific failures (EPERM installs, Prisma config) still needed manual detective work. Iterating on a single prompt would have been slower than typing the fix directly.
- Overall, I estimate a 40–50% time savings compared to hand-writing every file, with most gains in scaffolding and consistent typing.

## Improvements for Next Time
- Introduce automated tests before wiring the UI to catch regressions earlier.
- Log every `npx`/`npm` failure immediately into the agent conversation so it can propose fixes faster.
- Explore templated prompts (e.g., “create outbound adapter for <entity>”) to further standardize outputs when adding new modules.
# Reflection

Building the FuelEU prototype with AI support highlighted a clear split between high-leverage and high-touch work. The agent excelled at structuring repetitive layers (domain models, ports, React components) once I described the hexagonal layout precisely. This drastically reduced the time normally spent wiring boilerplate. However, the maturity of Prisma 7 and Tailwind 4 required human intervention: the agent defaulted to older configuration patterns, so I had to reconcile schema settings, adapter initialization, and Tailwind versions manually. That oversight reinforced the need to validate every scaffolded section against current tooling docs.

Efficiency gains were most visible during UI implementation. With the agent generating table layouts and hooks, I could focus on aligning KPIs and ensuring filters/actions mapped to the backend contract. In contrast, debugging npm install issues or Prisma migrations was slower when suggestions didn’t match the environment. I mitigated that by running commands myself and feeding back only the relevant errors for targeted assistance.

Next iteration improvements: (1) prepare a checklist of framework versions before prompting so the agent uses the right commands; (2) invest in automated tests early, letting the agent draft Jest/Vitest suites while core logic is still fresh; (3) capture prompts/output snippets in real time instead of retrospectively writing AGENT_WORKFLOW.md. Overall, pairing with the agent was productive as long as I stayed in the loop, validated outputs, and redirected it when context drifted.

