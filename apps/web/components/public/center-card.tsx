import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { centerTypeShort, formatKm, organizerLabel, placeLine } from '@/lib/public-format';
import { OpenLine } from './open-status';
import type { PublicCenter, PublicMeta } from '@/lib/public-types';
import { FreshnessLine, StatusBadges } from './freshness';
import { NeedsSummary } from './needs';

/**
 * Tarjeta de la lista. Pensada para leerse de un vistazo en el teléfono: el nombre primero, una
 * línea discreta con el tipo y quién organiza, dónde está y si está abierto, y lo que necesitan
 * como lista (no como frase), con aire entre bloques.
 */
export function CenterCard({
  center,
  meta,
  distanceKm,
  highlightItem,
  headingLevel = 3,
}: {
  center: PublicCenter;
  meta: PublicMeta | null;
  distanceKm?: number | null;
  highlightItem?: string | null;
  /** 4 cuando la tarjeta va bajo un encabezado de provincia. */
  headingLevel?: 3 | 4;
}) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  const urgent = center.needs.some((n) => n.level === 'URGENT');
  const organizer =
    center.organizerName && center.organizerName !== center.name
      ? center.organizerName
      : organizerLabel(meta, center.organizerType);
  const badges = <StatusBadges center={center} />;
  return (
    <article
      className={`relative flex flex-col gap-5 bg-cloth-pale p-5 shadow-cut transition-shadow focus-within:shadow-[var(--focus-ring)] hover:shadow-[0_0_0_2px_var(--color-ink)] ${
        urgent ? 'border-s-4 border-rojo' : 'border-s-4 border-keyline-soft'
      }`}
    >
      <header className="grid gap-2">
        {badges && <div className="flex flex-wrap gap-1.5">{badges}</div>}
        <Heading className="font-ui text-xl font-bold leading-snug text-ink">
          <Link
            href={`/c/${center.slug}`}
            className="text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none"
          >
            {center.name}
          </Link>
        </Heading>
        <p className="text-sm leading-relaxed text-ink-2">
          {centerTypeShort(meta, center.centerType)} · {organizer}
        </p>
      </header>

      <div className="grid gap-2 text-sm leading-relaxed text-ink">
        <p className="flex items-start gap-2">
          <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-ink-2" />
          <span>
            {placeLine(meta, center)}
            {distanceKm != null && (
              <strong className="ms-1 whitespace-nowrap font-semibold">· {formatKm(distanceKm)}</strong>
            )}
          </span>
        </p>
        <OpenLine center={center} />
      </div>

      <NeedsSummary center={center} meta={meta} highlight={highlightItem} />

      <FreshnessLine center={center} />
    </article>
  );
}
