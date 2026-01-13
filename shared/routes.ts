import { z } from 'zod';
import { insertSnippetSchema, snippets } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  snippets: {
    list: {
      method: 'GET' as const,
      path: '/api/snippets',
      responses: {
        200: z.array(z.custom<typeof snippets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/snippets/:id',
      responses: {
        200: z.custom<typeof snippets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/snippets',
      input: insertSnippetSchema,
      responses: {
        201: z.custom<typeof snippets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/snippets/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  run: {
    execute: {
      method: 'POST' as const,
      path: '/api/run',
      input: z.object({
        code: z.string(),
      }),
      responses: {
        200: z.object({
          output: z.string(),
          error: z.string().optional(),
        }),
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
