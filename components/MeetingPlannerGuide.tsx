import Link from 'next/link';
import { MEETING_GUIDES } from '@/lib/meetingGuides';
import type { ResolvedTimezone } from '@/utils/seoResolver';
import OverlapTable from '@/components/OverlapTable';
import InternalLinks from '@/components/InternalLinks';

export default function MeetingPlannerGuide({ zones, selectedDate }: { zones: ResolvedTimezone[]; selectedDate: string }) {
  return (
    <section aria-labelledby="meeting-guide-heading" className="w-full border-t border-border-custom py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {zones.length >= 2 && (
          <div className="w-full max-w-4xl mx-auto mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-4">
              {zones.map(zone => zone.displayName).join(' to ')} Business Hours Overlap Matrix
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mt-3">
              The table below maps out standard working hours (9:00 AM to 5:00 PM local time in {zones[0].displayName}) against their equivalent local times in {zones.slice(1).map(zone => zone.displayName).join(', ')}, highlighting overlapping business hours.
            </p>
            <OverlapTable zones={zones} selectedDate={selectedDate} />
          </div>
        )}
        <h2 id="meeting-guide-heading" className="text-xl sm:text-2xl font-bold text-txt-heading mb-5">
          Plan a meeting that works for everyone
        </h2>
        <div className="grid gap-6 md:grid-cols-3 text-sm leading-relaxed text-txt-secondary">
          <div>
            <h3 className="font-semibold text-txt-heading mb-2">Choose participants and a date</h3>
            <p>Add each participant’s city and select the meeting date. Seasonal clock changes can affect availability, so check the actual date rather than relying on today’s time difference.</p>
          </div>
          <div>
            <h3 className="font-semibold text-txt-heading mb-2">Review shared working hours</h3>
            <p>Set the working-hour range and look for overlap on the timeline. Confirm the proposed local time with participants; individual schedules and public holidays may differ from the highlighted hours.</p>
          </div>
          <div>
            <h3 className="font-semibold text-txt-heading mb-2">Prepare and share an invitation</h3>
            <p>Select a slot, add a title, duration, and agenda, then share the details or export a calendar invitation. Check the local dates and times before sending it to your team.</p>
          </div>
        </div>
        <div className="mt-8 text-sm leading-relaxed text-txt-secondary">
          <h3 className="font-semibold text-txt-heading mb-2">Use a time zone scheduler for recurring international meetings</h3>
          <p>A recurring meeting needs more than today&apos;s time difference. Check dates around each participant&apos;s daylight saving changes, keep the reference city consistent, and confirm the local time before exporting an invitation. If the team has no shared working hours, rotate early and late calls or use a written handover. Save and share the plan so everyone can check their own city and calendar date.</p>
        </div>
        <nav aria-label="Team meeting guides" className="mt-8">
          <h3 className="font-semibold text-txt-heading mb-3">Meeting planners for global teams</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {MEETING_GUIDES.map(guide => <li key={guide.slug}><Link className="text-brand-accent hover:underline" href={`/meeting-planner/${guide.slug}`}>{guide.title}</Link></li>)}
          </ul>
        </nav>
        <InternalLinks />
      </div>
    </section>
  );
}
