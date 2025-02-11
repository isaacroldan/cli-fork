import {
  CreateAppMutation,
  CreateAppMutationVariables,
  CreateAppMutationSchema,
} from './app-management-client/graphql/create-app.js'
import {
  ActiveAppReleaseQuery,
  ActiveAppReleaseQueryVariables,
  ActiveAppReleaseQuerySchema,
} from './app-management-client/graphql/active-app-release.js'
import {SpecificationsQuery, SpecificationsQuerySchema} from './app-management-client/graphql/specifications.js'
import {
  AppVersionsQuery,
  AppVersionsQueryVariables,
  AppVersionsQuerySchema,
} from './app-management-client/graphql/app-versions.js'
import {
  CreateAppVersionMutation,
  CreateAppVersionMutationSchema,
  CreateAppVersionMutationVariables,
} from './app-management-client/graphql/create-app-version.js'
import {
  ReleaseVersionMutation,
  ReleaseVersionMutationSchema,
  ReleaseVersionMutationVariables,
} from './app-management-client/graphql/release-version.js'
import {AppsQuery, AppsQuerySchema} from './app-management-client/graphql/apps.js'
import {
  OrganizationQuery,
  OrganizationQuerySchema,
  OrganizationQueryVariables,
} from './app-management-client/graphql/organization.js'
import {UserInfoQuery, UserInfoQuerySchema} from './app-management-client/graphql/user-info.js'
import {CreateAssetURLMutation, CreateAssetURLMutationSchema} from './app-management-client/graphql/create-asset-url.js'
import {
  AppVersionByIdQuery,
  AppVersionByIdQuerySchema,
  AppVersionByIdQueryVariables,
  AppModule as AppModuleReturnType,
} from './app-management-client/graphql/app-version-by-id.js'
import {
  OrganizationBetaFlagsQuerySchema,
  OrganizationBetaFlagsQueryVariables,
  organizationBetaFlagsQuery,
} from './app-management-client/graphql/organization_beta_flags.js'
import {RemoteSpecification} from '../../api/graphql/extension_specifications.js'
import {
  DeveloperPlatformClient,
  Paginateable,
  ActiveAppVersion,
  AppDeployOptions,
  AssetUrlSchema,
  AppVersionIdentifiers,
  DevSessionOptions,
  filterDisabledFlags,
  ClientName,
} from '../developer-platform-client.js'
import {PartnersSession} from '../../services/context/partner-account-info.js'
import {
  MinimalAppIdentifiers,
  MinimalOrganizationApp,
  Organization,
  OrganizationApp,
  OrganizationSource,
  OrganizationStore,
} from '../../models/organization.js'
import {
  AllAppExtensionRegistrationsQuerySchema,
  ExtensionRegistration,
} from '../../api/graphql/all_app_extension_registrations.js'
import {AppDeploySchema} from '../../api/graphql/app_deploy.js'
import {FindStoreByDomainSchema} from '../../api/graphql/find_store_by_domain.js'
import {AppVersionsQuerySchema as AppVersionsQuerySchemaInterface} from '../../api/graphql/get_versions_list.js'
import {ExtensionCreateSchema, ExtensionCreateVariables} from '../../api/graphql/extension_create.js'
import {
  ConvertDevToTransferDisabledSchema,
  ConvertDevToTransferDisabledStoreVariables,
} from '../../api/graphql/convert_dev_to_transfer_disabled_store.js'
import {FindAppPreviewModeSchema, FindAppPreviewModeVariables} from '../../api/graphql/find_app_preview_mode.js'
import {
  DevelopmentStorePreviewUpdateInput,
  DevelopmentStorePreviewUpdateSchema,
} from '../../api/graphql/development_preview.js'
import {AppReleaseSchema} from '../../api/graphql/app_release.js'
import {AppVersionByTagSchema as AppVersionByTagSchemaInterface} from '../../api/graphql/app_version_by_tag.js'
import {AppVersionsDiffSchema} from '../../api/graphql/app_versions_diff.js'
import {SendSampleWebhookSchema, SendSampleWebhookVariables} from '../../services/webhook/request-sample.js'
import {PublicApiVersionsSchema} from '../../services/webhook/request-api-versions.js'
import {WebhookTopicsSchema, WebhookTopicsVariables} from '../../services/webhook/request-topics.js'
import {
  MigrateFlowExtensionSchema,
  MigrateFlowExtensionVariables,
} from '../../api/graphql/extension_migrate_flow_extension.js'
import {UpdateURLsSchema, UpdateURLsVariables} from '../../api/graphql/update_urls.js'
import {CurrentAccountInfoSchema} from '../../api/graphql/current_account_info.js'
import {ExtensionTemplate} from '../../models/app/template.js'
import {TargetSchemaDefinitionQueryVariables} from '../../api/graphql/functions/target_schema_definition.js'
import {ApiSchemaDefinitionQueryVariables} from '../../api/graphql/functions/api_schema_definition.js'
import {
  MigrateToUiExtensionVariables,
  MigrateToUiExtensionSchema,
} from '../../api/graphql/extension_migrate_to_ui_extension.js'
import {MigrateAppModuleSchema, MigrateAppModuleVariables} from '../../api/graphql/extension_migrate_app_module.js'
import {AppLogsSubscribeVariables, AppLogsSubscribeResponse} from '../../api/graphql/subscribe_to_app_logs.js'
import {
  ExtensionUpdateDraftMutation,
  ExtensionUpdateDraftMutationVariables,
} from '../../api/graphql/partners/generated/update-draft.js'
import {ListOrganizations} from '../../api/graphql/business-platform-destinations/generated/organizations.js'
import {AppHomeSpecIdentifier} from '../../models/extensions/specifications/app_config_app_home.js'
import {BrandingSpecIdentifier} from '../../models/extensions/specifications/app_config_branding.js'
import {WebhooksSpecIdentifier} from '../../models/extensions/specifications/app_config_webhook.js'
import {AppAccessSpecIdentifier} from '../../models/extensions/specifications/app_config_app_access.js'
import {CONFIG_EXTENSION_IDS} from '../../models/extensions/extension-instance.js'
import {DevSessionCreate, DevSessionCreateMutation} from '../../api/graphql/app-dev/generated/dev-session-create.js'
import {DevSessionUpdate, DevSessionUpdateMutation} from '../../api/graphql/app-dev/generated/dev-session-update.js'
import {DevSessionDelete, DevSessionDeleteMutation} from '../../api/graphql/app-dev/generated/dev-session-delete.js'
import {
  FetchDevStoreByDomain,
  FetchDevStoreByDomainQueryVariables,
} from '../../api/graphql/business-platform-organizations/generated/fetch_dev_store_by_domain.js'
import {
  ListAppDevStores,
  ListAppDevStoresQuery,
} from '../../api/graphql/business-platform-organizations/generated/list_app_dev_stores.js'
import {ensureAuthenticatedAppManagement, ensureAuthenticatedBusinessPlatform} from '@shopify/cli-kit/node/session'
import {FunctionUploadUrlGenerateResponse} from '@shopify/cli-kit/node/api/partners'
import {isUnitTest} from '@shopify/cli-kit/node/context/local'
import {AbortError, BugError} from '@shopify/cli-kit/node/error'
import {fetch} from '@shopify/cli-kit/node/http'
import {appManagementRequest} from '@shopify/cli-kit/node/api/app-management'
import {appDevRequest} from '@shopify/cli-kit/node/api/app-dev'
import {
  businessPlatformOrganizationsRequest,
  businessPlatformOrganizationsRequestDoc,
  businessPlatformRequest,
  businessPlatformRequestDoc,
} from '@shopify/cli-kit/node/api/business-platform'
import {CLI_KIT_VERSION} from '@shopify/cli-kit/common/version'
import {versionSatisfies} from '@shopify/cli-kit/node/node-package-manager'
import {outputWarn} from '@shopify/cli-kit/node/output'
import {developerDashboardFqdn} from '@shopify/cli-kit/node/context/fqdn'

const TEMPLATE_JSON_URL = 'https://raw.githubusercontent.com/Shopify/extensions-templates/main/templates.json'

type OrgType = NonNullable<ListAppDevStoresQuery['organization']>
type Properties = NonNullable<OrgType['properties']>
type ShopEdge = NonNullable<Properties['edges'][number]>
type ShopNode = Exclude<ShopEdge['node'], {[key: string]: never}>
export interface GatedExtensionTemplate extends ExtensionTemplate {
  organizationBetaFlags?: string[]
  minimumCliVersion?: string
}

export class AppManagementClient implements DeveloperPlatformClient {
  public clientName = ClientName.AppManagement
  public webUiName = 'Developer Dashboard'
  public requiresOrganization = true
  public supportsAtomicDeployments = true
  private _session: PartnersSession | undefined
  private _businessPlatformToken: string | undefined

  constructor(session?: PartnersSession) {
    this._session = session
  }

  async subscribeToAppLogs(input: AppLogsSubscribeVariables): Promise<AppLogsSubscribeResponse> {
    throw new Error(`Not Implemented: ${input}`)
  }

  async session(): Promise<PartnersSession> {
    if (!this._session) {
      if (isUnitTest()) {
        throw new Error('AppManagementClient.session() should not be invoked dynamically in a unit test')
      }
      const userInfoResult = await businessPlatformRequest<UserInfoQuerySchema>(
        UserInfoQuery,
        await this.businessPlatformToken(),
      )
      const token = await ensureAuthenticatedAppManagement()
      if (userInfoResult.currentUserAccount) {
        this._session = {
          token,
          accountInfo: {
            type: 'UserAccount',
            email: userInfoResult.currentUserAccount.email,
          },
        }
      } else {
        this._session = {
          token,
          accountInfo: {
            type: 'UnknownAccount',
          },
        }
      }
    }
    return this._session
  }

  async token(): Promise<string> {
    return (await this.session()).token
  }

  async refreshToken(): Promise<string> {
    const newToken = await ensureAuthenticatedAppManagement([], process.env, {noPrompt: true})
    const session = await this.session()
    if (newToken) {
      session.token = newToken
    }
    return session.token
  }

  async businessPlatformToken(): Promise<string> {
    if (isUnitTest()) {
      throw new Error('AppManagementClient.businessPlatformToken() should not be invoked dynamically in a unit test')
    }
    if (!this._businessPlatformToken) {
      this._businessPlatformToken = await ensureAuthenticatedBusinessPlatform()
    }
    return this._businessPlatformToken
  }

  async accountInfo(): Promise<PartnersSession['accountInfo']> {
    return (await this.session()).accountInfo
  }

  async appFromId(appIdentifiers: MinimalAppIdentifiers): Promise<OrganizationApp | undefined> {
    const {app} = await this.fetchApp(appIdentifiers)
    const {name, appModules} = app.activeRelease.version
    const appAccessModule = appModules.find((mod) => mod.specification.externalIdentifier === 'app_access')
    const appHomeModule = appModules.find((mod) => mod.specification.externalIdentifier === 'app_home')
    const apiSecretKeys = app.activeRoot.clientCredentials.secrets.map((secret) => ({secret: secret.key}))
    return {
      id: app.id,
      title: name,
      apiKey: app.key,
      apiSecretKeys,
      organizationId: appIdentifiers.organizationId,
      grantedScopes: (appAccessModule?.config?.scopes as string[] | undefined) ?? [],
      applicationUrl: appHomeModule?.config?.app_url as string | undefined,
      flags: [],
      developerPlatformClient: this,
    }
  }

  async organizations(): Promise<Organization[]> {
    const organizationsResult = await businessPlatformRequestDoc(ListOrganizations, await this.businessPlatformToken())
    if (!organizationsResult.currentUserAccount) return []
    return organizationsResult.currentUserAccount.organizations.nodes.map((org) => ({
      id: idFromEncodedGid(org.id),
      businessName: org.name,
      source: OrganizationSource.BusinessPlatform,
    }))
  }

  async orgFromId(orgId: string): Promise<Organization | undefined> {
    const base64Id = encodedGidFromId(orgId)
    const variables: OrganizationQueryVariables = {organizationId: base64Id}
    const organizationResult = await businessPlatformRequest<OrganizationQuerySchema>(
      OrganizationQuery,
      await this.businessPlatformToken(),
      variables,
    )
    const org = organizationResult.currentUserAccount.organization
    if (!org) {
      return
    }
    return {
      id: orgId,
      businessName: org.name,
      source: OrganizationSource.BusinessPlatform,
    }
  }

  async orgAndApps(
    organizationId: string,
  ): Promise<Paginateable<{organization: Organization; apps: MinimalOrganizationApp[]}>> {
    const [organization, {apps, hasMorePages}] = await Promise.all([
      this.orgFromId(organizationId),
      this.appsForOrg(organizationId),
    ])
    return {organization: organization!, apps, hasMorePages}
  }

  async appsForOrg(organizationId: string, _term?: string): Promise<Paginateable<{apps: MinimalOrganizationApp[]}>> {
    const query = AppsQuery
    const result = await appManagementRequest<AppsQuerySchema>(organizationId, query, await this.token())
    const minimalOrganizationApps = result.apps.map((app) => {
      return {
        id: app.id,
        apiKey: app.key,
        title: app.activeRelease.version.name,
        organizationId,
      }
    })
    return {
      apps: minimalOrganizationApps,
      hasMorePages: false,
    }
  }

  async specifications({organizationId}: MinimalAppIdentifiers): Promise<RemoteSpecification[]> {
    const query = SpecificationsQuery
    const result = await appManagementRequest<SpecificationsQuerySchema>(organizationId, query, await this.token())
    return result.specifications.map(
      (spec): RemoteSpecification => ({
        name: spec.name,
        externalName: spec.name,
        identifier: spec.identifier,
        externalIdentifier: spec.externalIdentifier,
        gated: false,
        options: {
          managementExperience: 'cli',
          registrationLimit: spec.uidStrategy.appModuleLimit,
        },
        experience: experience(spec.identifier),
      }),
    )
  }

  async templateSpecifications({organizationId}: MinimalAppIdentifiers): Promise<ExtensionTemplate[]> {
    let response
    let templates: GatedExtensionTemplate[]
    try {
      response = await fetch(TEMPLATE_JSON_URL)
      templates = await (response.json() as Promise<GatedExtensionTemplate[]>)
    } catch (_e) {
      throw new AbortError(
        [
          'Failed to fetch extension templates from',
          {link: {url: TEMPLATE_JSON_URL}},
          {char: '.'},
          'This likely means a problem with GitHub.',
        ],
        [
          {link: {url: 'https://www.githubstatus.com', label: 'Check if GitHub is experiencing downtime'}},
          'or try again later.',
        ],
      )
    }
    // Fake the sortPriority as ascending, since the templates are already sorted
    // in the static JSON file. This can be removed once PartnersClient, which
    // uses sortPriority, is gone.
    let counter = 0
    return (
      await allowedTemplates(templates, async (betaFlags: string[]) =>
        this.organizationBetaFlags(organizationId, betaFlags),
      )
    ).map((template) => ({...template, sortPriority: counter++}))
  }

  async createApp(
    org: Organization,
    name: string,
    options?: {
      isLaunchable?: boolean
      scopesArray?: string[]
      directory?: string
    },
  ): Promise<OrganizationApp> {
    const variables = createAppVars(name, options?.isLaunchable, options?.scopesArray)

    const mutation = CreateAppMutation
    const result = await appManagementRequest<CreateAppMutationSchema>(org.id, mutation, await this.token(), variables)
    if (result.appCreate.userErrors?.length > 0) {
      const errors = result.appCreate.userErrors.map((error) => error.message).join(', ')
      throw new AbortError(errors)
    }

    // Need to figure this out still
    const flags = filterDisabledFlags([])
    const createdApp = result.appCreate.app
    return {
      ...createdApp,
      title: name,
      apiKey: createdApp.key,
      apiSecretKeys: [],
      grantedScopes: options?.scopesArray ?? [],
      organizationId: org.id,
      newApp: true,
      flags,
      developerPlatformClient: this,
    }
  }

  // we are returning OrganizationStore type here because we want to keep types consistent btwn
  // partners-client and app-management-client. Since we need transferDisabled and convertableToPartnerTest values
  // from the Partners OrganizationStore schema, we will return this type for now
  async devStoresForOrg(orgId: string): Promise<OrganizationStore[]> {
    const storesResult = await businessPlatformOrganizationsRequestDoc<ListAppDevStoresQuery>(
      ListAppDevStores,
      await this.businessPlatformToken(),
      orgId,
    )
    const organization = storesResult.organization

    if (!organization) {
      throw new AbortError(`No organization found`)
    }

    const shopArray = organization.properties?.edges.map((value) => value.node as ShopNode) ?? []
    return mapBusinessPlatformStoresToOrganizationStores(shopArray)
  }

  async appExtensionRegistrations(
    appIdentifiers: MinimalAppIdentifiers,
  ): Promise<AllAppExtensionRegistrationsQuerySchema> {
    const {app} = await this.fetchApp(appIdentifiers)
    const configurationRegistrations: ExtensionRegistration[] = []
    const extensionRegistrations: ExtensionRegistration[] = []
    app.activeRelease.version.appModules.forEach((mod) => {
      const registration = {
        id: mod.uuid,
        uid: mod.uuid,
        uuid: mod.uuid,
        title: mod.specification.name,
        type: mod.specification.identifier,
      }
      if (CONFIG_EXTENSION_IDS.includes(mod.uuid)) {
        configurationRegistrations.push(registration)
      } else {
        extensionRegistrations.push(registration)
      }
    })
    return {
      app: {
        dashboardManagedExtensionRegistrations: [],
        configurationRegistrations,
        extensionRegistrations,
      },
    }
  }

  async appVersions({id, organizationId, title}: OrganizationApp): Promise<AppVersionsQuerySchemaInterface> {
    const query = AppVersionsQuery
    const variables: AppVersionsQueryVariables = {appId: id}
    const result = await appManagementRequest<AppVersionsQuerySchema>(
      organizationId,
      query,
      await this.token(),
      variables,
    )
    return {
      app: {
        id: result.app.id,
        organizationId,
        title,
        appVersions: {
          nodes: result.versions.map((version) => {
            return {
              createdAt: version.createdAt,
              createdBy: {
                displayName: version.createdBy,
              },
              versionTag: version.metadata.versionTag,
              status: version.id === result.app.activeRelease.version.id ? 'active' : 'inactive',
              versionId: version.id,
              message: version.metadata.message,
            }
          }),
          pageInfo: {
            totalResults: result.versions.length,
          },
        },
      },
    }
  }

  async appVersionByTag(
    {id: appId, apiKey, organizationId}: MinimalOrganizationApp,
    tag: string,
  ): Promise<AppVersionByTagSchemaInterface> {
    const query = AppVersionsQuery
    const variables: AppVersionsQueryVariables = {appId}
    const result = await appManagementRequest<AppVersionsQuerySchema>(
      organizationId,
      query,
      await this.token(),
      variables,
    )
    if (!result.app) {
      throw new AbortError(`App not found for API key: ${apiKey}`)
    }
    const version = result.versions.find((version) => version.metadata.versionTag === tag)
    if (!version) {
      throw new AbortError(`Version not found for tag: ${tag}`)
    }

    const query2 = AppVersionByIdQuery
    const variables2: AppVersionByIdQueryVariables = {versionId: version.id}
    const result2 = await appManagementRequest<AppVersionByIdQuerySchema>(
      organizationId,
      query2,
      await this.token(),
      variables2,
    )
    const versionInfo = result2.version

    return {
      app: {
        appVersion: {
          id: parseInt(versionInfo.id, 10),
          uuid: versionInfo.id,
          versionTag: versionInfo.metadata.versionTag,
          location: [await appDeepLink({organizationId, id: appId}), 'versions', numberFromGid(versionInfo.id)].join(
            '/',
          ),
          message: '',
          appModuleVersions: versionInfo.appModules.map((mod: AppModuleReturnType) => {
            return {
              registrationId: mod.uuid,
              registrationUid: mod.uuid,
              registrationUuid: mod.uuid,
              registrationTitle: mod.handle,
              type: mod.specification.externalIdentifier,
              config: JSON.stringify(mod.config),
              specification: {
                ...mod.specification,
                identifier: mod.specification.externalIdentifier,
                options: {managementExperience: 'cli'},
                experience: experience(mod.specification.identifier),
              },
            }
          }),
        },
      },
    }
  }

  async appVersionsDiff(
    app: MinimalOrganizationApp,
    {versionId}: AppVersionIdentifiers,
  ): Promise<AppVersionsDiffSchema> {
    const variables: AppVersionByIdQueryVariables = {versionId}
    const [currentVersion, selectedVersion] = await Promise.all([
      this.activeAppVersionRawResult(app),
      appManagementRequest<AppVersionByIdQuerySchema>(
        app.organizationId,
        AppVersionByIdQuery,
        await this.token(),
        variables,
      ),
    ])
    const currentModules = currentVersion.app.activeRelease.version.appModules
    const selectedVersionModules = selectedVersion.version.appModules
    const {added, removed, updated} = diffAppModules({currentModules, selectedVersionModules})

    function formattedModule(mod: AppModuleReturnType) {
      return {
        uuid: mod.uuid,
        registrationTitle: mod.handle,
        specification: {
          identifier: mod.specification.identifier,
          experience: experience(mod.specification.identifier),
          options: {
            managementExperience: 'cli',
          },
        },
      }
    }

    return {
      app: {
        versionsDiff: {
          added: added.map(formattedModule),
          updated: updated.map(formattedModule),
          removed: removed.map(formattedModule),
        },
      },
    }
  }

  async activeAppVersion(app: MinimalAppIdentifiers): Promise<ActiveAppVersion> {
    const result = await this.activeAppVersionRawResult(app)
    return {
      appModuleVersions: result.app.activeRelease.version.appModules.map((mod) => {
        return {
          registrationId: mod.uuid,
          registrationUid: mod.uuid,
          registrationUuid: mod.uuid,
          registrationTitle: mod.handle,
          type: mod.specification.externalIdentifier,
          config: mod.config,
          specification: {
            ...mod.specification,
            identifier: mod.specification.identifier,
            options: {managementExperience: 'cli'},
            experience: experience(mod.specification.identifier),
          },
        }
      }),
      ...result.app.activeRelease,
    }
  }

  async functionUploadUrl(): Promise<FunctionUploadUrlGenerateResponse> {
    throw new BugError('Not implemented: functionUploadUrl')
  }

  async generateSignedUploadUrl({organizationId}: MinimalAppIdentifiers): Promise<AssetUrlSchema> {
    const result = await appManagementRequest<CreateAssetURLMutationSchema>(
      organizationId,
      CreateAssetURLMutation,
      await this.token(),
    )
    return {
      assetUrl: result.appRequestSourceUploadUrl.sourceUploadUrl,
      userErrors: result.appRequestSourceUploadUrl.userErrors,
    }
  }

  async updateExtension(_extensionInput: ExtensionUpdateDraftMutationVariables): Promise<ExtensionUpdateDraftMutation> {
    throw new BugError('Not implemented: updateExtension')
  }

  async deploy({
    appId,
    name,
    appModules,
    organizationId,
    versionTag,
    bundleUrl,
    skipPublish: noRelease,
  }: AppDeployOptions): Promise<AppDeploySchema> {
    // `name` is from the package.json package name or the directory name, while
    // the branding module reflects the current specified name in the TOML.
    // Since it is technically valid to not have a branding module, we will default
    // to the `name` if no branding module is present.
    let updatedName = name
    const brandingModule = appModules?.find((mod) => mod.specificationIdentifier === BrandingSpecIdentifier)
    if (brandingModule) {
      updatedName = JSON.parse(brandingModule.config).name
    }
    const variables: CreateAppVersionMutationVariables = {
      appId,
      name: updatedName,
      appSource: {
        assetsUrl: bundleUrl,
        appModules: (appModules ?? []).map((mod) => {
          return {
            uid: mod.uid ?? mod.uuid ?? mod.handle,
            specificationIdentifier: mod.specificationIdentifier,
            handle: mod.handle,
            config: JSON.parse(mod.config),
          }
        }),
      },
      metadata: versionTag ? {versionTag} : {},
    }

    const result = await appManagementRequest<CreateAppVersionMutationSchema>(
      organizationId,
      CreateAppVersionMutation,
      await this.token(),
      variables,
    )
    const {version, userErrors} = result.appVersionCreate
    if (!version) return {appDeploy: {userErrors}} as unknown as AppDeploySchema

    const versionResult = {
      appDeploy: {
        appVersion: {
          uuid: version.id,
          // Need to deal with ID properly as it's expected to be a number... how do we use it?
          id: parseInt(version.id, 10),
          versionTag: version.metadata.versionTag,
          location: await versionDeepLink(organizationId, appId, version.id),
          appModuleVersions: version.appModules.map((mod) => {
            return {
              uuid: mod.uuid,
              registrationUuid: mod.uuid,
              validationErrors: [],
            }
          }),
          message: version.metadata.message,
        },
        userErrors: userErrors?.map((err) => ({...err, details: []})),
      },
    }
    if (noRelease) return versionResult

    const releaseVariables: ReleaseVersionMutationVariables = {appId, versionId: version.id}
    const releaseResult = await appManagementRequest<ReleaseVersionMutationSchema>(
      organizationId,
      ReleaseVersionMutation,
      await this.token(),
      releaseVariables,
    )
    if (releaseResult.appReleaseCreate?.userErrors) {
      versionResult.appDeploy.userErrors = (versionResult.appDeploy.userErrors ?? []).concat(
        releaseResult.appReleaseCreate.userErrors.map((err) => ({...err, details: []})),
      )
    }

    return versionResult
  }

  async release({
    app: {id: appId, organizationId},
    version: {versionId},
  }: {
    app: MinimalOrganizationApp
    version: AppVersionIdentifiers
  }): Promise<AppReleaseSchema> {
    const releaseVariables: ReleaseVersionMutationVariables = {appId, versionId}
    const releaseResult = await appManagementRequest<ReleaseVersionMutationSchema>(
      organizationId,
      ReleaseVersionMutation,
      await this.token(),
      releaseVariables,
    )
    return {
      appRelease: {
        appVersion: {
          versionTag: releaseResult.appReleaseCreate.release.version.metadata.versionTag,
          message: releaseResult.appReleaseCreate.release.version.metadata.message,
          location: [
            await appDeepLink({organizationId, id: appId}),
            'versions',
            numberFromGid(releaseResult.appReleaseCreate.release.version.id),
          ].join('/'),
        },
        userErrors: releaseResult.appReleaseCreate.userErrors?.map((err) => ({
          field: err.field,
          message: err.message,
          category: '',
          details: [],
        })),
      },
    }
  }

  // we are using FindStoreByDomainSchema type here because we want to keep types consistent btwn
  // partners-client and app-management-client. Since we need transferDisabled and convertableToPartnerTest values
  // from the Partners FindByStoreDomainSchema, we will return this type for now
  async storeByDomain(orgId: string, shopDomain: string): Promise<FindStoreByDomainSchema> {
    const queryVariables: FetchDevStoreByDomainQueryVariables = {domain: shopDomain}
    const storesResult = await businessPlatformOrganizationsRequestDoc(
      FetchDevStoreByDomain,
      await this.businessPlatformToken(),
      orgId,
      queryVariables,
    )

    const organization = storesResult.organization

    if (!organization) {
      throw new AbortError(`No organization found`)
    }

    const bpStoresArray = organization.properties?.edges.map((value) => value.node as ShopNode) ?? []
    const storesArray = mapBusinessPlatformStoresToOrganizationStores(bpStoresArray)

    return {
      organizations: {
        nodes: [
          {
            id: organization.id,
            businessName: organization.name,
            stores: {
              nodes: storesArray,
            },
          },
        ],
      },
    }
  }

  async createExtension(_input: ExtensionCreateVariables): Promise<ExtensionCreateSchema> {
    throw new BugError('Not implemented: createExtension')
  }

  async convertToTransferDisabledStore(
    _input: ConvertDevToTransferDisabledStoreVariables,
  ): Promise<ConvertDevToTransferDisabledSchema> {
    throw new BugError('Not implemented: convertToTransferDisabledStore')
  }

  async updateDeveloperPreview(
    _input: DevelopmentStorePreviewUpdateInput,
  ): Promise<DevelopmentStorePreviewUpdateSchema> {
    throw new BugError('Not implemented: updateDeveloperPreview')
  }

  async appPreviewMode(_input: FindAppPreviewModeVariables): Promise<FindAppPreviewModeSchema> {
    throw new BugError('Not implemented: appPreviewMode')
  }

  async sendSampleWebhook(_input: SendSampleWebhookVariables): Promise<SendSampleWebhookSchema> {
    outputWarn('⚠️ sendSampleWebhook is not implemented')
    return {
      sendSampleWebhook: {
        samplePayload: '',
        headers: '{}',
        success: true,
        userErrors: [],
      },
    }
  }

  async apiVersions(): Promise<PublicApiVersionsSchema> {
    outputWarn('⚠️ apiVersions is not implemented')
    return {publicApiVersions: ['unstable']}
  }

  async topics(_input: WebhookTopicsVariables): Promise<WebhookTopicsSchema> {
    throw new BugError('Not implemented: topics')
  }

  async migrateFlowExtension(_input: MigrateFlowExtensionVariables): Promise<MigrateFlowExtensionSchema> {
    throw new BugError('Not implemented: migrateFlowExtension')
  }

  async migrateAppModule(_input: MigrateAppModuleVariables): Promise<MigrateAppModuleSchema> {
    throw new BugError('Not implemented: migrateAppModule')
  }

  async updateURLs(_input: UpdateURLsVariables): Promise<UpdateURLsSchema> {
    outputWarn('⚠️ updateURLs is not implemented')
    return {appUpdate: {userErrors: []}}
  }

  async currentAccountInfo(): Promise<CurrentAccountInfoSchema> {
    throw new BugError('Not implemented: currentAccountInfo')
  }

  async targetSchemaDefinition(_input: TargetSchemaDefinitionQueryVariables): Promise<string | null> {
    throw new BugError('Not implemented: targetSchemaDefinition')
  }

  async apiSchemaDefinition(_input: ApiSchemaDefinitionQueryVariables): Promise<string | null> {
    throw new BugError('Not implemented: apiSchemaDefinition')
  }

  async migrateToUiExtension(_input: MigrateToUiExtensionVariables): Promise<MigrateToUiExtensionSchema> {
    throw new BugError('Not implemented: migrateToUiExtension')
  }

  toExtensionGraphQLType(input: string) {
    return input.toLowerCase()
  }

  async appDeepLink({id, organizationId}: Pick<MinimalAppIdentifiers, 'id' | 'organizationId'>): Promise<string> {
    return appDeepLink({id, organizationId})
  }

  async devSessionCreate({appId, assetsUrl, shopFqdn}: DevSessionOptions): Promise<DevSessionCreateMutation> {
    const appIdNumber = String(numberFromGid(appId))
    return appDevRequest(DevSessionCreate, shopFqdn, await this.token(), {appId: appIdNumber, assetsUrl})
  }

  async devSessionUpdate({appId, assetsUrl, shopFqdn}: DevSessionOptions): Promise<DevSessionUpdateMutation> {
    const appIdNumber = String(numberFromGid(appId))
    return appDevRequest(DevSessionUpdate, shopFqdn, await this.token(), {appId: appIdNumber, assetsUrl})
  }

  async devSessionDelete({appId, shopFqdn}: Omit<DevSessionOptions, 'assetsUrl'>): Promise<DevSessionDeleteMutation> {
    const appIdNumber = String(numberFromGid(appId))
    return appDevRequest(DevSessionDelete, shopFqdn, await this.token(), {appId: appIdNumber})
  }

  private async fetchApp({id, organizationId}: MinimalAppIdentifiers): Promise<ActiveAppReleaseQuerySchema> {
    const query = ActiveAppReleaseQuery
    const variables: ActiveAppReleaseQueryVariables = {appId: id}
    return appManagementRequest<ActiveAppReleaseQuerySchema>(organizationId, query, await this.token(), variables)
  }

  private async activeAppVersionRawResult({
    id,
    organizationId,
  }: MinimalAppIdentifiers): Promise<ActiveAppReleaseQuerySchema> {
    const variables: ActiveAppReleaseQueryVariables = {appId: id}
    return appManagementRequest<ActiveAppReleaseQuerySchema>(
      organizationId,
      ActiveAppReleaseQuery,
      await this.token(),
      variables,
    )
  }

  private async organizationBetaFlags(
    organizationId: string,
    allBetaFlags: string[],
  ): Promise<{[flag: (typeof allBetaFlags)[number]]: boolean}> {
    const variables: OrganizationBetaFlagsQueryVariables = {organizationId: encodedGidFromId(organizationId)}
    const flagsResult = await businessPlatformOrganizationsRequest<OrganizationBetaFlagsQuerySchema>(
      organizationBetaFlagsQuery(allBetaFlags),
      await this.businessPlatformToken(),
      organizationId,
      variables,
    )
    const result: {[flag: (typeof allBetaFlags)[number]]: boolean} = {}
    allBetaFlags.forEach((flag) => {
      result[flag] = Boolean(flagsResult.organization[`flag_${flag}`])
    })
    return result
  }
}

// this is a temporary solution for editions to support https://vault.shopify.io/gsd/projects/31406
// read more here: https://vault.shopify.io/gsd/projects/31406
const MAGIC_URL = 'https://shopify.dev/apps/default-app-home'
const MAGIC_REDIRECT_URL = 'https://shopify.dev/apps/default-app-home/api/auth'

function createAppVars(name: string, isLaunchable = true, scopesArray?: string[]): CreateAppMutationVariables {
  return {
    appSource: {
      appModules: [
        {
          // Change the uid to AppHomeSpecIdentifier
          uid: 'app_home',
          specificationIdentifier: AppHomeSpecIdentifier,
          config: {
            app_url: isLaunchable ? 'https://example.com' : MAGIC_URL,
            embedded: isLaunchable,
          },
        },
        {
          // Change the uid to BrandingSpecIdentifier
          uid: 'branding',
          specificationIdentifier: BrandingSpecIdentifier,
          config: {name},
        },
        {
          // Change the uid to WebhooksSpecIdentifier
          uid: 'webhooks',
          specificationIdentifier: WebhooksSpecIdentifier,
          config: {api_version: '2024-01'},
        },
        {
          // Change the uid to AppAccessSpecIdentifier
          uid: 'app_access',
          specificationIdentifier: AppAccessSpecIdentifier,
          config: {
            redirect_url_allowlist: isLaunchable ? ['https://example.com/api/auth'] : [MAGIC_REDIRECT_URL],
            ...(scopesArray && {scopes: scopesArray.map((scope) => scope.trim()).join(',')}),
          },
        },
      ],
    },
    name,
  }
}

// Business platform uses base64-encoded GIDs, while App Management uses
// just the integer portion of that ID. These functions convert between the two.

// 1234 => gid://organization/Organization/1234 => base64
export function encodedGidFromId(id: string): string {
  const gid = `gid://organization/Organization/${id}`
  return Buffer.from(gid).toString('base64')
}

// base64 => gid://organization/Organization/1234 => 1234
function idFromEncodedGid(gid: string): string {
  const decodedGid = Buffer.from(gid, 'base64').toString('ascii')
  return numberFromGid(decodedGid).toString()
}

// gid://organization/Organization/1234 => 1234
function numberFromGid(gid: string): number {
  return Number(gid.match(/^gid.*\/(\d+)$/)![1])
}

async function appDeepLink({
  id,
  organizationId,
}: Pick<MinimalAppIdentifiers, 'id' | 'organizationId'>): Promise<string> {
  return `https://${await developerDashboardFqdn()}/dashboard/${organizationId}/apps/${numberFromGid(id)}`
}

export async function versionDeepLink(organizationId: string, appId: string, versionId: string): Promise<string> {
  const appLink = await appDeepLink({organizationId, id: appId})
  return `${appLink}/versions/${numberFromGid(versionId)}`
}

interface DiffAppModulesInput {
  currentModules: AppModuleReturnType[]
  selectedVersionModules: AppModuleReturnType[]
}

interface DiffAppModulesOutput {
  added: AppModuleReturnType[]
  removed: AppModuleReturnType[]
  updated: AppModuleReturnType[]
}

export function diffAppModules({currentModules, selectedVersionModules}: DiffAppModulesInput): DiffAppModulesOutput {
  const currentModuleUids = currentModules.map((mod) => mod.uuid)
  const selectedVersionModuleUids = selectedVersionModules.map((mod) => mod.uuid)
  const removed = currentModules.filter((mod) => !selectedVersionModuleUids.includes(mod.uuid))
  const added = selectedVersionModules.filter((mod) => !currentModuleUids.includes(mod.uuid))
  const addedUids = added.map((mod) => mod.uuid)
  const updated = selectedVersionModules.filter((mod) => !addedUids.includes(mod.uuid))
  return {added, removed, updated}
}

export async function allowedTemplates(
  templates: GatedExtensionTemplate[],
  betaFlagsFetcher: (betaFlags: string[]) => Promise<{[key: string]: boolean}>,
): Promise<GatedExtensionTemplate[]> {
  const allBetaFlags = Array.from(new Set(templates.map((ext) => ext.organizationBetaFlags ?? []).flat()))
  const enabledBetaFlags = await betaFlagsFetcher(allBetaFlags)
  return templates.filter((ext) => {
    const hasAnyNeededBetas =
      !ext.organizationBetaFlags || ext.organizationBetaFlags.every((flag) => enabledBetaFlags[flag])
    const satisfiesMinCliVersion =
      !ext.minimumCliVersion || versionSatisfies(CLI_KIT_VERSION, `>=${ext.minimumCliVersion}`)
    return hasAnyNeededBetas && satisfiesMinCliVersion
  })
}

function experience(identifier: string): 'configuration' | 'extension' {
  return CONFIG_EXTENSION_IDS.includes(identifier) ? 'configuration' : 'extension'
}

function mapBusinessPlatformStoresToOrganizationStores(storesArray: ShopNode[]): OrganizationStore[] {
  return storesArray.map((store: ShopNode) => {
    const {externalId, primaryDomain, name} = store
    return {
      shopId: externalId,
      link: primaryDomain,
      shopDomain: primaryDomain,
      shopName: name,
      transferDisabled: true,
      convertableToPartnerTest: true,
    } as OrganizationStore
  })
}
