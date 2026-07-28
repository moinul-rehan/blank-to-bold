"use client";

import { RoomStage } from "@/features/studio/room-stage";
import { Text } from "@/components/primitives/text";

/**
 * The studio — replaces the scroll-scene experience as the entry point.
 * No nav bar, no page list: every object in the room is the navigation.
 * See docs/07-story-architecture.md for why the room's content is still
 * TODO-marked placeholder.
 */
export function Studio() {
  return (
    <div className="fixed inset-0">
      <RoomStage />
      <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 text-center">
        <Text
          as="p"
          className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.2em] uppercase"
        >
          {/* TODO(content): replace once the studio's real objects/story are decided */}
          A designer&apos;s studio — everything here can be touched
        </Text>
      </div>
    </div>
  );
}
