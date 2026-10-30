import fs from 'fs'
import path from 'path'
import raw from './chewpack-docs.json'
import type {
  Category,
  DocsData,
  DocumentRef,
  Feature,
  Guide,
  PublicShortcut,
  Shortcut
} from './types'

export type * from './types'

const data = raw as unknown as DocsData
const contentDir = path.join(process.cwd(), 'content', 'docs')

// Segments under /docs that are taken by fixed routes.
const reservedSlugs = ['shortcuts', 'topic', 'guide']

validate(data)

export const product = data.product

// "[x.y.z]" is a placeholder until a real version is filled in.
export const appVersion = /^\d+(\.\d+)*$/.test(data.appVersion.trim())
  ? data.appVersion.trim()
  : null

export const categories = [...data.categories].sort((a, b) => a.order - b.order)
export const features = data.features
export const documents = data.documents
export const guides = data.guides
export const shortcuts = data.shortcuts

const byId = <T extends { id: string }>(items: T[]) =>
  new Map(items.map(item => [item.id, item]))

const categoryMap = byId(data.categories)
const featureMap = byId(data.features)
const documentMap = byId(data.documents)
const guideMap = byId(data.guides)
const shortcutMap = byId(data.shortcuts)

function lookup<T> (map: Map<string, T>, kind: string, id: string): T {
  const item = map.get(id)
  if (!item) throw new Error(`[docs] Unknown ${kind} id "${id}"`)
  return item
}

export const getCategory = (id: string): Category =>
  lookup(categoryMap, 'category', id)
export const getFeature = (id: string): Feature =>
  lookup(featureMap, 'feature', id)
export const getDocument = (id: string): DocumentRef =>
  lookup(documentMap, 'document', id)
export const getShortcut = (id: string): Shortcut =>
  lookup(shortcutMap, 'shortcut', id)

export const findCategory = (id: string) => categoryMap.get(id)
export const findFeature = (id: string) => featureMap.get(id)
export const findDocument = (id: string) => documentMap.get(id)
export const findGuide = (id: string) => guideMap.get(id)

export const featuresIn = (categoryId: string) =>
  data.features.filter(feature => feature.category === categoryId)
export const documentsIn = (categoryId: string) =>
  data.documents.filter(doc => doc.category === categoryId)

export function readDocument (doc: DocumentRef) {
  return fs.readFileSync(path.join(contentDir, doc.file), 'utf8')
}

export function toPublicShortcut (shortcut: Shortcut): PublicShortcut {
  const rest: Partial<Shortcut> = { ...shortcut }
  delete rest.source
  return rest as PublicShortcut
}

// Groups in first-appearance order.
export function shortcutGroups () {
  const groups = new Map<string, Shortcut[]>()
  for (const shortcut of data.shortcuts) {
    const list = groups.get(shortcut.group) ?? []
    list.push(shortcut)
    groups.set(shortcut.group, list)
  }
  return [...groups].map(([group, items]) => ({ group, items }))
}

export const featureHref = (id: string) => `/docs/${getFeature(id).id}`
export const documentHref = (id: string) => `/docs/${getDocument(id).id}`
export const categoryHref = (id: string) => `/docs/topic/${getCategory(id).id}`
export const guideHref = (guide: Guide) => `/docs/guide/${guide.id}`

export function featuresToVerify () {
  return data.features
    .filter(feature => feature.verify?.length)
    .map(feature => ({ id: feature.id, verify: feature.verify! }))
}

function validate (docs: DocsData) {
  const errors: string[] = []
  const ids = (items: { id: string }[]) => new Set(items.map(item => item.id))
  const categoryIds = ids(docs.categories)
  const featureIds = ids(docs.features)
  const documentIds = ids(docs.documents)
  const shortcutIds = ids(docs.shortcuts)

  const check = (ok: boolean, message: string) => {
    if (!ok) errors.push(message)
  }

  // Features and documents share the /docs/:id namespace.
  const slugs = new Set<string>(reservedSlugs)
  for (const { id } of [...docs.features, ...docs.documents]) {
    check(!slugs.has(id), `"${id}" is used twice under /docs/`)
    slugs.add(id)
  }
  for (const list of [docs.categories, docs.guides, docs.shortcuts]) {
    check(ids(list).size === list.length, 'duplicate ids in content')
  }

  for (const feature of docs.features) {
    const at = `feature "${feature.id}"`
    check(categoryIds.has(feature.category), `${at}: unknown category "${feature.category}"`)
    check(['stable', 'beta'].includes(feature.status), `${at}: unknown status "${feature.status}"`)
    for (const id of feature.related) check(featureIds.has(id), `${at}: unknown related feature "${id}"`)
    for (const id of feature.shortcuts) check(shortcutIds.has(id), `${at}: unknown shortcut "${id}"`)
    if (feature.doc) check(documentIds.has(feature.doc), `${at}: unknown document "${feature.doc}"`)
    for (const media of feature.media) {
      check(['image', 'video'].includes(media.type), `${at}: unknown media type "${media.type}"`)
    }
  }

  for (const doc of docs.documents) {
    check(categoryIds.has(doc.category), `document "${doc.id}": unknown category "${doc.category}"`)
    check(fs.existsSync(path.join(contentDir, doc.file)), `document "${doc.id}": missing file "${doc.file}"`)
  }

  for (const shortcut of docs.shortcuts) {
    check(
      ['global', 'canvas', 'scripting'].includes(shortcut.context),
      `shortcut "${shortcut.id}": unknown context "${shortcut.context}"`
    )
  }

  for (const guide of docs.guides) {
    const at = `guide "${guide.id}"`
    if (guide.doc) check(documentIds.has(guide.doc), `${at}: unknown document "${guide.doc}"`)
    for (const step of guide.steps) {
      for (const id of step.features) check(featureIds.has(id), `${at}: unknown feature "${id}"`)
    }
  }

  if (errors.length) {
    throw new Error(`[docs] chewpack-docs.json has broken references:\n- ${errors.join('\n- ')}`)
  }
}
