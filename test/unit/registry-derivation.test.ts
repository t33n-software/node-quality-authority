/**
 * White-box contract tests for the territory registry derivation block.
 *
 * The registry instance is hash-pinned by consuming tenants, and the fleet
 * verifier proves tenant config bindings fail-closed against the declared
 * derivation. A silently malformed or missing block would break every
 * downstream tenant verification, so the territory home carries the proof
 * of its own shape. Every test outcome runs through vitest matchers; the
 * adopted `@sindresorhus/is` assertions appear only as fixture
 * preconditions that narrow parsed unknown documents to their record face.
 *
 * @module
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { assert } from '@sindresorhus/is'

import { beforeAll, describe, expect, it } from 'vitest'

/**
 * Absolute path of the repository root of this home.
 */
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

/**
 * Absolute path of the registry instance document.
 */
const REGISTRY_PATH = join(REPO_ROOT, 'configs', 'registry.json')

/**
 * Closed grammar of a Corepack package-manager identity declaration.
 */
const COREPACK_IDENTITY_PATTERN = /^[a-z][a-z-]*@\d+\.\d+\.\d+$/

/**
 * Narrows a parsed JSON document to its record face as a precondition.
 *
 * A non-record parsed document means the JSON file itself is broken, so
 * this is a fixture precondition violation and never a test expectation.
 *
 * @param parsed - The parsed JSON document in its unknown face.
 * @throws When the parsed document is not a plain object.
 */
function mustBeDocumentRecord(parsed: unknown): asserts parsed is Record<string, unknown> {
    assert.plainObject(parsed)
}

/**
 * Reads the derivation record of the registry document as a precondition.
 *
 * @param document - The registry document, already narrowed to a record.
 * @returns The derivation block as a record.
 * @throws When the derivation block is missing or not a plain object.
 */
function readDerivation(document: Record<string, unknown>): Record<string, unknown> {
    const derivation: unknown = document['derivation']
    mustBeDocumentRecord(derivation)
    return derivation
}

describe('registry derivation contract', () => {
    let registryDocument: unknown

    beforeAll(() => {
        registryDocument = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'))
    })

    it('pins the schema version of the registry instance', () => {
        mustBeDocumentRecord(registryDocument)
        expect(registryDocument).toHaveProperty(['schemaVersion'], 1)
    })

    it('declares the package contract file and the json parse format', () => {
        mustBeDocumentRecord(registryDocument)
        const derivation: Record<string, unknown> = readDerivation(registryDocument)
        expect(derivation).toHaveProperty(['contractFile'], 'package.json')
        expect(derivation).toHaveProperty(['format'], 'json')
    })

    it('binds the corepack packageManager identity extraction', () => {
        mustBeDocumentRecord(registryDocument)
        const derivation: Record<string, unknown> = readDerivation(registryDocument)
        expect(derivation).toHaveProperty(['identity', 'field'], 'packageManager')
        expect(derivation).toHaveProperty(['identity', 'form'], 'corepack')
    })

    it('maps the pnpm workspace document and the fortress baseline', () => {
        mustBeDocumentRecord(registryDocument)
        const derivation: Record<string, unknown> = readDerivation(registryDocument)
        expect(derivation).toHaveProperty(
            ['workspaceFiles', 'pnpm'],
            'pnpm-workspace.yaml'
        )
        expect(derivation).toHaveProperty(
            ['baselineFile'],
            'configs/pnpm/pnpm-workspace.base.yaml'
        )
        expect(derivation).toHaveProperty(['tenantOwnedKeys'], ['catalog'])
    })

    it('keeps the declared baseline path resolvable inside the home tree', () => {
        mustBeDocumentRecord(registryDocument)
        const derivation: Record<string, unknown> = readDerivation(registryDocument)
        const baselineFile: unknown = derivation['baselineFile']
        assert.string(baselineFile)
        expect(existsSync(join(REPO_ROOT, baselineFile))).toBe(true)
    })

    it('proves every declared tenant-owned key is a governed baseline key', () => {
        mustBeDocumentRecord(registryDocument)
        const derivation: Record<string, unknown> = readDerivation(registryDocument)
        const baselineFile: unknown = derivation['baselineFile']
        const tenantOwnedKeys: unknown = derivation['tenantOwnedKeys']
        assert.string(baselineFile)
        assert.array(tenantOwnedKeys)
        const baselineText: string = readFileSync(join(REPO_ROOT, baselineFile), 'utf8')
        for (const tenantKey of tenantOwnedKeys) {
            assert.string(tenantKey)
            const governedKeyPattern: RegExp = new RegExp(`^${tenantKey}:`, 'm')
            expect(governedKeyPattern.test(baselineText)).toBe(true)
        }
    })

    it('proves the tenant package contract carries a corepack-parseable identity', () => {
        const contract: unknown = JSON.parse(
            readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')
        )
        mustBeDocumentRecord(contract)
        expect(contract['packageManager']).toEqual(
            expect.stringMatching(COREPACK_IDENTITY_PATTERN)
        )
    })

    it('keeps every category artifact folder present on disk', () => {
        mustBeDocumentRecord(registryDocument)
        const categories: unknown = registryDocument['categories']
        assert.array(categories)
        expect(categories.length).toBeGreaterThan(0)
        for (const category of categories) {
            mustBeDocumentRecord(category)
            const artifacts: unknown = category['artifacts']
            mustBeDocumentRecord(artifacts)
            const artifactFolders: unknown[] = Object.values(artifacts)
            expect(artifactFolders.length).toBeGreaterThan(0)
            for (const artifactFolder of artifactFolders) {
                assert.string(artifactFolder)
                expect(existsSync(join(REPO_ROOT, artifactFolder))).toBe(true)
            }
        }
    })
})
