import { Badge } from '@demogar/mola-ui';
import { itemLabel, needsAt } from '@/lib/public-format';
import type { NeedLevel, PublicCenter, PublicMeta, PublicNeed } from '@/lib/public-types';

const ROWS: {
  level: NeedLevel;
  label: string;
  tone: 'danger' | 'warn' | 'neutral';
  variant: 'solid' | 'soft' | 'outline';
}[] = [
  { level: 'URGENT', label: 'Urgente', tone: 'danger', variant: 'solid' },
  { level: 'NEEDED', label: 'Necesitan', tone: 'warn', variant: 'soft' },
  { level: 'ENOUGH', label: 'Ya no necesitan', tone: 'neutral', variant: 'outline' },
];

/** Cuántos artículos se listan por grupo en la tarjeta antes de resumir el resto. */
const MAX_PER_GROUP = 4;

function Item({
  need,
  meta,
  highlight,
  strong,
}: {
  need: PublicNeed;
  meta: PublicMeta | null;
  highlight?: string | null;
  strong: boolean;
}) {
  const label = itemLabel(meta, need.item);
  if (highlight === need.item) return <mark className="bg-oro-soft px-0.5 font-semibold text-ink">{label}</mark>;
  return <span className={strong ? 'font-semibold' : ''}>{label}</span>;
}

/** Un grupo de la tarjeta: etiqueta corta y una lista con un artículo por línea. */
function NeedGroup({
  title,
  swatch,
  titleClass,
  needs,
  meta,
  highlight,
}: {
  title: string;
  swatch: string;
  titleClass: string;
  needs: PublicNeed[];
  meta: PublicMeta | null;
  highlight?: string | null;
}) {
  const shown = needs.slice(0, MAX_PER_GROUP);
  const rest = needs.length - shown.length;
  return (
    <div className="grid gap-1.5">
      <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${titleClass}`}>
        <span aria-hidden="true" className={`inline-block size-2.5 ${swatch}`} />
        {title}
      </p>
      <ul className="grid gap-1 ps-4.5 text-sm leading-relaxed text-ink">
        {shown.map((n) => (
          <li key={n.item} className="list-disc marker:text-ink-muted">
            <Item need={n} meta={meta} highlight={highlight} strong={title === 'Urgente'} />
          </li>
        ))}
        {rest > 0 && (
          <li className="list-none text-ink-2">y {rest === 1 ? '1 artículo más' : `${rest} artículos más`}</li>
        )}
      </ul>
    </div>
  );
}

/** Lo que necesitan, en la tarjeta: «Urgente» y «Necesitan» como listas; lo que ya no aceptan, en una línea discreta. */
export function NeedsSummary({
  center,
  meta,
  highlight,
}: {
  center: Pick<PublicCenter, 'needs'>;
  meta: PublicMeta | null;
  highlight?: string | null;
}) {
  const urgent = needsAt(center, 'URGENT');
  const needed = needsAt(center, 'NEEDED');
  const enough = needsAt(center, 'ENOUGH');
  if (urgent.length + needed.length + enough.length === 0)
    return (
      <p className="text-sm leading-relaxed text-ink-2">Sin necesidades publicadas. Pregunta antes de llevar algo.</p>
    );
  return (
    <div className="grid gap-4">
      {urgent.length > 0 && (
        <NeedGroup
          title="Urgente"
          swatch="bg-rojo"
          titleClass="text-ink-danger"
          needs={urgent}
          meta={meta}
          highlight={highlight}
        />
      )}
      {needed.length > 0 && (
        <NeedGroup
          title="Necesitan"
          swatch="bg-oro"
          titleClass="text-ink-2"
          needs={needed}
          meta={meta}
          highlight={highlight}
        />
      )}
      {enough.length > 0 && (
        <p className="text-sm leading-relaxed text-ink-2">
          <span className="font-semibold">Ya no necesitan:</span>{' '}
          {enough.map((n) => itemLabel(meta, n.item)).join(', ')}.
        </p>
      )}
    </div>
  );
}

/** Lista completa para la ficha: grupos con encabezado y la nota de cada artículo. */
export function NeedsDetail({ center, meta }: { center: Pick<PublicCenter, 'needs'>; meta: PublicMeta | null }) {
  const groups = [
    { ...ROWS[0], title: 'Urgente', hint: 'Lo que más falta ahora.' },
    { ...ROWS[1], title: 'Necesitan', hint: 'También les sirve.' },
    { ...ROWS[2], title: 'Ya no necesitan', hint: 'Por ahora tienen suficiente: no lo lleves.' },
  ]
    .map((g) => ({ ...g, needs: needsAt(center, g.level) }))
    .filter((g) => g.needs.length > 0);
  if (groups.length === 0) {
    return <p className="text-ink-2">Este centro no ha publicado qué necesita. Pregunta antes de llevar algo.</p>;
  }
  return (
    <div className="grid gap-6">
      {groups.map((g) => (
        <section key={g.level} aria-labelledby={`need-${g.level}`}>
          <h3 id={`need-${g.level}`} className="flex flex-wrap items-center gap-2 font-ui text-base font-bold">
            <Badge tone={g.tone} variant={g.variant}>
              {g.title}
            </Badge>
            <span className="text-sm font-normal text-ink-2">{g.hint}</span>
          </h3>
          <ul className="mt-3 grid gap-2">
            {g.needs.map((n) => (
              <li
                key={n.item}
                className={`border-s-4 ps-3 leading-relaxed ${g.level === 'URGENT' ? 'border-rojo' : g.level === 'NEEDED' ? 'border-oro' : 'border-keyline'}`}
              >
                <span className={g.level === 'ENOUGH' ? 'text-ink-2' : 'font-semibold'}>{itemLabel(meta, n.item)}</span>
                {n.note && <span className="block text-sm text-ink-2">{n.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
