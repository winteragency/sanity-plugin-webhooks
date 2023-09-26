import {
  Badge,
  BadgeTone,
  Flex,
  FlexAlign,
  FlexWrap,
  Inline,
  Label
} from '@sanity/ui';

export function BadgeRow({
  heading,
  badges,
  align = 'center',
  wrap = 'wrap',
  tone = 'primary'
}: {
  heading: string;
  badges: string[];
  align?: FlexAlign | FlexAlign[];
  wrap?: FlexWrap | FlexWrap[];
  tone?: BadgeTone;
}) {
  return (
    <Flex gap={2} align={align} wrap={wrap}>
      <Label size={2}>{heading}</Label>
      {badges.map((tag: string) => (
        <Inline key={tag}>
          <Badge mode="outline" tone={tone}>
            <span style={{ textTransform: 'none', wordBreak: 'break-word' }}>
              {tag}
            </span>
          </Badge>
        </Inline>
      ))}
    </Flex>
  );
}
