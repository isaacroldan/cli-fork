/* eslint-disable @typescript-eslint/consistent-type-definitions */
import * as Types from './types.js'

import {TypedDocumentNode as DocumentNode} from '@graphql-typed-document-node/core'

export type FetchDevStoreByDomainQueryVariables = Types.Exact<{
  domain?: Types.InputMaybe<Types.Scalars['String']['input']>
}>

export type FetchDevStoreByDomainQuery = {
  organization?: {
    id: string
    name: string
    properties?: {
      edges: {
        node:
          | {id: unknown; externalId?: unknown | null}
          | {id: unknown; externalId?: unknown | null}
          | {
              name: string
              storeType?: Types.Store | null
              primaryDomain?: string | null
              shortName?: string | null
              id: unknown
              externalId?: unknown | null
            }
      }[]
    } | null
  } | null
}

export const FetchDevStoreByDomain = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: {kind: 'Name', value: 'FetchDevStoreByDomain'},
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {kind: 'Variable', name: {kind: 'Name', value: 'domain'}},
          type: {kind: 'NamedType', name: {kind: 'Name', value: 'String'}},
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: {kind: 'Name', value: 'organization'},
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {kind: 'Field', name: {kind: 'Name', value: 'id'}},
                {kind: 'Field', name: {kind: 'Name', value: 'name'}},
                {
                  kind: 'Field',
                  name: {kind: 'Name', value: 'properties'},
                  arguments: [
                    {
                      kind: 'Argument',
                      name: {kind: 'Name', value: 'search'},
                      value: {kind: 'Variable', name: {kind: 'Name', value: 'domain'}},
                    },
                    {
                      kind: 'Argument',
                      name: {kind: 'Name', value: 'offeringHandles'},
                      value: {kind: 'ListValue', values: [{kind: 'StringValue', value: 'shop', block: false}]},
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: {kind: 'Name', value: 'edges'},
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {kind: 'Name', value: 'node'},
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {kind: 'Field', name: {kind: 'Name', value: 'id'}},
                                  {kind: 'Field', name: {kind: 'Name', value: 'externalId'}},
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {kind: 'NamedType', name: {kind: 'Name', value: 'Shop'}},
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {kind: 'Field', name: {kind: 'Name', value: 'name'}},
                                        {kind: 'Field', name: {kind: 'Name', value: 'storeType'}},
                                        {kind: 'Field', name: {kind: 'Name', value: 'primaryDomain'}},
                                        {kind: 'Field', name: {kind: 'Name', value: 'shortName'}},
                                        {kind: 'Field', name: {kind: 'Name', value: '__typename'}},
                                      ],
                                    },
                                  },
                                  {kind: 'Field', name: {kind: 'Name', value: '__typename'}},
                                ],
                              },
                            },
                            {kind: 'Field', name: {kind: 'Name', value: '__typename'}},
                          ],
                        },
                      },
                      {kind: 'Field', name: {kind: 'Name', value: '__typename'}},
                    ],
                  },
                },
                {kind: 'Field', name: {kind: 'Name', value: '__typename'}},
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FetchDevStoreByDomainQuery, FetchDevStoreByDomainQueryVariables>
