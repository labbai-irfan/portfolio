import type { ComponentType } from 'react';
import type { StructureBuilder, StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { ActivityIcon } from '@sanity/icons/Activity';
import { CalendarIcon } from '@sanity/icons/Calendar';
import { CaseIcon } from '@sanity/icons/Case';
import { CheckmarkCircleIcon } from '@sanity/icons/CheckmarkCircle';
import { CogIcon } from '@sanity/icons/Cog';
import { CubeIcon } from '@sanity/icons/Cube';
import { DocumentsIcon } from '@sanity/icons/Documents';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { HomeIcon } from '@sanity/icons/Home';
import { RocketIcon } from '@sanity/icons/Rocket';
import { TagIcon } from '@sanity/icons/Tag';
import { WarningOutlineIcon } from '@sanity/icons/WarningOutline';
import { WrenchIcon } from '@sanity/icons/Wrench';
import { PROJECT_STATUSES } from './schemaTypes/constants';

// Order: Site settings · Page copy · Home · Projects · Blog · Journey · Certifications ·
// Experience · Skills · Infrastructure. Site status (written by CI) sits last.

function singleton(S: StructureBuilder, type: string, title: string, icon: ComponentType) {
  return S.listItem()
    .title(title)
    .id(type)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Needs review')
        .id('needs-review')
        .icon(WarningOutlineIcon)
        .child(
          S.documentList()
            .title('Needs review')
            .filter('needsReview == true')
            .apiVersion('2026-10-01'),
        ),
      S.divider(),
      singleton(S, 'siteSettings', 'Site settings', CogIcon),
      singleton(S, 'pageCopy', 'Page copy', DocumentsIcon),
      singleton(S, 'homePage', 'Home', HomeIcon),
      S.divider(),

      S.listItem()
        .title('Projects')
        .id('projects')
        .icon(RocketIcon)
        .child(
          S.list()
            .title('Projects')
            .items([
              orderableDocumentListDeskItem({
                type: 'project',
                title: 'All projects (drag to reorder)',
                icon: RocketIcon,
                S,
                context,
              }),
              S.divider(),
              ...PROJECT_STATUSES.map(({ title, value }) =>
                S.listItem()
                  .title(title)
                  .id(`project-${value}`)
                  .icon(RocketIcon)
                  .child(
                    S.documentList()
                      .title(title)
                      .schemaType('project')
                      .filter('_type == "project" && status == $status')
                      .params({ status: value })
                      .defaultOrdering([{ field: 'orderRank', direction: 'asc' }]),
                  ),
              ),
            ]),
        ),

      S.listItem()
        .title('Blog')
        .id('blog')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('note').title('Posts').icon(DocumentTextIcon),
              S.documentTypeListItem('noteCategory').title('Categories').icon(TagIcon),
            ]),
        ),

      orderableDocumentListDeskItem({
        type: 'milestone',
        title: 'Journey',
        icon: CalendarIcon,
        S,
        context,
      }),
      S.documentTypeListItem('credential').title('Certifications').icon(CheckmarkCircleIcon),
      S.documentTypeListItem('role').title('Experience').icon(CaseIcon),
      orderableDocumentListDeskItem({
        type: 'skill',
        title: 'Skills',
        icon: WrenchIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'infraNode',
        title: 'Infrastructure',
        icon: CubeIcon,
        S,
        context,
      }),

      S.divider(),
      singleton(S, 'siteStatus', 'Site status (written by CI)', ActivityIcon),
    ]);
