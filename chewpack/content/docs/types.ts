export interface DocsData {
  schemaVersion: 1
  appVersion: string
  generatedFrom: string
  product: {
    name: string
    tagline: string
    platform: string
    price: string
    website: string
    projectFileExtension: string
  }
  categories: Category[]
  documents: DocumentRef[]
  features: Feature[]
  shortcuts: Shortcut[]
  guides: Guide[]
}

export interface Category {
  id: string
  order: number
  title: string
  glyph: string
  summary: string
}

export interface DocumentRef {
  id: string
  title: string
  file: string
  summary: string
  category: string
}

export interface Feature {
  id: string
  category: string
  title: string
  summary: string
  where: string[]
  status: 'stable' | 'beta'
  body: string
  shortcuts: string[]
  related: string[]
  doc?: string
  // Notes for the author, never rendered.
  verify?: string[]
  media: Media[]
}

export interface Media {
  type: 'image' | 'video'
  src: string
  alt: string
  caption?: string
}

export interface Shortcut {
  id: string
  keys: string[]
  action: string
  context: 'global' | 'canvas' | 'scripting'
  group: string
  menuPath?: string
  // Internal, never rendered.
  source: 'menu' | 'code'
  note?: string
}

export interface Guide {
  id: string
  title: string
  summary: string
  specimen: string
  minutes: number
  doc?: string
  steps: GuideStep[]
}

export interface GuideStep {
  title: string
  text: string
  keys: string[]
  features: string[]
  code?: string
}

// What the shortcuts page and search send to the browser.
export type PublicShortcut = Omit<Shortcut, 'source'>
