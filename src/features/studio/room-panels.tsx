"use client";

import { PanelShell } from "@/features/studio/panel-shell";
import { Text } from "@/components/primitives/text";
import { Stack } from "@/components/primitives/stack";

// TODO(content): every panel below is structural placeholder — no real
// biography, project details, journal entries, or facts have been decided
// yet (see docs/07-story-architecture.md, still an open decision).

function Placeholder({ lines }: { lines: string[] }) {
  return (
    <Stack gap="1.25rem">
      {lines.map((line) => (
        <Text key={line} as="p" className="text-muted-foreground max-w-md text-base leading-7">
          {line}
        </Text>
      ))}
    </Stack>
  );
}

export function AboutPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Photo Frame" title="About" onClose={onClose}>
      <Placeholder lines={["TODO — who Rehan is, told as a story rather than a résumé."]} />
    </PanelShell>
  );
}

export function ProjectsPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Monitor" title="Selected Work" onClose={onClose}>
      <Placeholder lines={[
        "TODO — Project One, one line.",
        "TODO — Project Two, one line.",
        "TODO — Project Three, one line.",
      ]} />
    </PanelShell>
  );
}

export function ProcessPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Sketchbook" title="Design Process" onClose={onClose}>
      <Placeholder lines={["TODO — how a sketch becomes a system, in Rehan's own steps."]} />
    </PanelShell>
  );
}

export function JournalPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Notebook" title="Journal" onClose={onClose}>
      <Placeholder lines={["TODO — thoughts, lessons, and the occasional failure, honestly told."]} />
    </PanelShell>
  );
}

export function ExperimentsPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Sticky Notes" title="Quick Experiments" onClose={onClose}>
      <Placeholder lines={["TODO — small interactive prototypes and fun ideas, in progress."]} />
    </PanelShell>
  );
}

export function LearningPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Bookshelf" title="Learning Journey" onClose={onClose}>
      <Placeholder lines={["TODO — books and courses that mark real steps in the journey."]} />
    </PanelShell>
  );
}

export function HiddenPlaygroundPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Drawer" title="Hidden Playground" onClose={onClose}>
      <Placeholder lines={["TODO — unreleased concept work, kept in the drawer on purpose."]} />
    </PanelShell>
  );
}

export function FutureVisionPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Window" title="Future Vision" onClose={onClose}>
      <Placeholder lines={["TODO — where this is all heading next."]} />
    </PanelShell>
  );
}

export function RandomFactsPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Coffee Mug" title="Random Facts" onClose={onClose}>
      <Placeholder lines={["TODO — small, personal, off-duty details."]} />
    </PanelShell>
  );
}

export function SystemsThinkingPanel({ onClose }: { onClose: () => void }) {
  return (
    <PanelShell eyebrow="Whiteboard" title="Systems Thinking" onClose={onClose}>
      <Placeholder lines={["TODO — the architecture and flows behind the work, not just the pixels."]} />
    </PanelShell>
  );
}
