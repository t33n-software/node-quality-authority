// ═══╡ 🧩 IMPORTS ╞═══
import { defineConfig } from 'vitest/config'

// ═══╡ 🏷️TYPES ╞═══
import type { ViteUserConfig } from 'vitest/config'

/*
 * 📋 Root configuration of the test runner.
 * Carries only global, process-wide options (coverage) and the project
 * registration. Shared test options, plugins, and setup orchestration live in
 * vitest.base.config.ts.
 */
const cfg = defineConfig({
    test: {
        /**
         * Configuration for coverage reporting.
         */
        coverage: {
            /**
             * Specifies whether coverage is enabled.
             */
            enabled: true,

            /**
             * Specifies the files or directories to exclude from coverage.
             */
            exclude: [
                'dist/',
                'out/',
                'log/',
                '.cursor/'
            ],

            /**
             * Specifies the directories to include for coverage.
             */
            include: ['src/'],

            /**
             * Specifies the coverage provider to use.
             */
            provider: 'v8',

            /**
             * Specifies the coverage reporters to use.
             */
            reporter: [
                'text',
                'json',
                'html'
            ]
        },

        /**
         * Project configurations keep the verification surfaces distinct while
         * sharing one baseline. The unit lane is the first registered suite.
         */
        projects: [
            './vitest.unit.config.ts'
        ],

        /**
         * The unit lane is intentionally registered while the home carries no
         * tests yet: a filtered empty run reports "No test files found" and
         * still exits green.
         */
        passWithNoTests: true
    }
}) satisfies ViteUserConfig

/**
 * Represents the configuration for the Vitest test runner.
 */
export default cfg
