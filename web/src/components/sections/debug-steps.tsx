import { CodeBlock } from '@/components/ui/code-block';
import { DebugStep } from './debug-step';
import { type Fetched, stegaClean } from '@/lib/stega';
import { cx } from '@/lib/utils';
import type { NOTE_QUERY_RESULT } from '@/sanity/types';

export type DebugStepsData = NonNullable<Fetched<NonNullable<NOTE_QUERY_RESULT>>['debugSteps']>;

const prose = 'm-0 text-17 leading-[1.7] text-body';

/** The four-step debugging format: symptom, investigation, root cause + fix, prevention. */
export function DebugSteps({ steps }: { steps: DebugStepsData }) {
  const checks = steps.checks ?? [];
  const fix = steps.fix;
  return (
    <div className="flex flex-col gap-10">
      {(steps.symptom || steps.errorLog) && (
        <DebugStep index={0} title="Symptom">
          {steps.symptom && <p className={prose}>{steps.symptom}</p>}
          {steps.errorLog && (
            <CodeBlock code={steps.errorLog.code} filename={steps.errorLog.filename} />
          )}
        </DebugStep>
      )}

      {checks.length > 0 && (
        <DebugStep index={1} title="What I checked">
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            {checks.map((check) => {
              const found = stegaClean(check.outcome) === 'foundIt';
              return (
                <li
                  key={check._key}
                  className={cx(
                    'flex flex-col gap-2 border p-4',
                    found ? 'border-signal bg-progress-bg' : 'border-rule bg-surface',
                  )}
                >
                  <code className="font-mono text-14 break-words text-ink">{check.command}</code>
                  <p className="m-0 text-15 leading-[1.55] text-body">{check.result}</p>
                  <span
                    className={cx(
                      'font-mono text-11 tracking-label uppercase',
                      found ? 'text-progress' : 'text-muted',
                    )}
                  >
                    {found ? 'Found it' : 'Ruled out'}
                  </span>
                </li>
              );
            })}
          </ol>
        </DebugStep>
      )}

      {(steps.rootCause ||
        steps.explanation ||
        fix?.before ||
        fix?.after ||
        steps.verification) && (
        <DebugStep index={2} title="Root cause and fix">
          {steps.rootCause && (
            <p className="m-0 text-20 leading-[1.4] font-semibold tracking-lead text-ink">
              {steps.rootCause}
            </p>
          )}
          {steps.explanation && <p className={prose}>{steps.explanation}</p>}
          {(fix?.before || fix?.after) && (
            <div className="flex flex-wrap gap-4">
              {fix.before && (
                <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2">
                  <span className="font-mono text-11 tracking-label text-muted uppercase">
                    Before
                  </span>
                  <CodeBlock code={fix.before} />
                </div>
              )}
              {fix.after && (
                <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2">
                  <span className="font-mono text-11 tracking-label text-muted uppercase">
                    After
                  </span>
                  <CodeBlock code={fix.after} />
                </div>
              )}
            </div>
          )}
          {steps.verification && (
            <p className={prose}>
              <strong className="font-semibold text-ink">Verified: </strong>
              {steps.verification}
            </p>
          )}
        </DebugStep>
      )}

      {steps.prevention && (
        <DebugStep index={3} title="Prevention">
          <p className="m-0 border border-rule-strong bg-surface p-6 text-17 leading-[1.7] text-ink">
            {steps.prevention}
          </p>
        </DebugStep>
      )}
    </div>
  );
}
