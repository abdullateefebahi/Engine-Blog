import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: "isNotice",
      title: "Announcement / Notice",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isEvent",
      title: "Is Event?",
      type: "boolean",
      initialValue: false,
      description: "Mark this post as an event to show it on the Events page."
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "datetime",
      hidden: ({ document }) => !document?.isEvent,
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      hidden: ({ document }) => !document?.isEvent,
    }),
    defineField({
      name: "isTrending",
      title: "Trending Post",
      type: "boolean",
      initialValue: false,
      description: "Manually mark this post as trending regardless of engagement score."
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      title: 'Excerpt',
      description: 'A brief summary of the post for search results and the blog list.',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
