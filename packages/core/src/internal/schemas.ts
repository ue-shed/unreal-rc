import { Schema } from "effect";

// Unreal responses carry fields beyond the ones modelled here (e.g. call
// out-parameters such as `OutRowNames`). Response schemas declare a
// string-keyed rest so those fields survive decoding.
const withExtraKeys = <const S extends Schema.Struct<Schema.Struct.Fields>>(schema: S) =>
  Schema.StructWithRest(schema, [Schema.Record(Schema.String, Schema.Unknown)]);

// ── Enums ──────────────────────────────────────────────────────────────

export const HttpVerbSchema = Schema.Literals(["GET", "PUT", "POST", "PATCH", "DELETE"]);

export const AccessModeSchema = Schema.Literals([
  "READ_ACCESS",
  "WRITE_ACCESS",
  "WRITE_TRANSACTION_ACCESS",
]);

// ── Object Call ────────────────────────────────────────────────────────

export const ObjectCallRequestSchema = Schema.Struct({
  objectPath: Schema.NonEmptyString,
  functionName: Schema.NonEmptyString,
  parameters: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
  generateTransaction: Schema.optional(Schema.Boolean),
});

export const ObjectCallResponseSchema = withExtraKeys(
  Schema.Struct({
    ReturnValue: Schema.optional(Schema.Unknown),
  }),
);

// ── Object Property ────────────────────────────────────────────────────

export const ObjectPropertyRequestSchema = Schema.Struct({
  objectPath: Schema.NonEmptyString,
  propertyName: Schema.optional(Schema.NonEmptyString),
  propertyValue: Schema.optional(Schema.Unknown),
  access: Schema.optional(AccessModeSchema),
});

export const ObjectPropertyResponseSchema = Schema.Record(Schema.String, Schema.Unknown);

// ── Object Describe ────────────────────────────────────────────────────

export const ObjectDescribeRequestSchema = Schema.Struct({
  objectPath: Schema.NonEmptyString,
});

export const PropertyMetadataSchema = withExtraKeys(
  Schema.Struct({
    Name: Schema.String,
    Description: Schema.optional(Schema.String),
    Type: Schema.optional(Schema.String),
    Metadata: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
  }),
);

export const FunctionArgumentSchema = withExtraKeys(
  Schema.Struct({
    Name: Schema.String,
    Type: Schema.optional(Schema.String),
    Description: Schema.optional(Schema.String),
    Metadata: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
  }),
);

export const FunctionMetadataSchema = withExtraKeys(
  Schema.Struct({
    Name: Schema.String,
    Description: Schema.optional(Schema.String),
    ReturnType: Schema.optional(Schema.String),
    Arguments: Schema.optional(Schema.Array(FunctionArgumentSchema)),
    Metadata: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
  }),
);

export const ObjectDescribeResponseSchema = withExtraKeys(
  Schema.Struct({
    Name: Schema.optional(Schema.String),
    Class: Schema.optional(Schema.String),
    DisplayName: Schema.optional(Schema.String),
    Path: Schema.optional(Schema.String),
    Properties: Schema.optional(Schema.Array(PropertyMetadataSchema)),
    Functions: Schema.optional(Schema.Array(FunctionMetadataSchema)),
  }),
);

// ── Search Assets ──────────────────────────────────────────────────────

export const SearchAssetsRequestSchema = Schema.Struct({
  query: Schema.optional(Schema.String),
  classNames: Schema.optional(Schema.Array(Schema.String)),
  packagePaths: Schema.optional(Schema.Array(Schema.String)),
  recursivePaths: Schema.optional(Schema.Boolean),
  recursiveClasses: Schema.optional(Schema.Boolean),
  includeOnlyOnDiskAssets: Schema.optional(Schema.Boolean),
});

export const AssetInfoSchema = withExtraKeys(
  Schema.Struct({
    Name: Schema.optional(Schema.String),
    ObjectPath: Schema.optional(Schema.String),
    PackageName: Schema.optional(Schema.String),
    PackagePath: Schema.optional(Schema.String),
    AssetClass: Schema.optional(Schema.String),
    Class: Schema.optional(Schema.String),
  }),
);

export const SearchAssetsResponseSchema = withExtraKeys(
  Schema.Struct({
    Assets: Schema.optional(Schema.Array(AssetInfoSchema)),
    Results: Schema.optional(Schema.Array(AssetInfoSchema)),
  }),
);

// ── Batch ──────────────────────────────────────────────────────────────

export const BatchRequestItemSchema = Schema.Struct({
  RequestId: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
  URL: Schema.NonEmptyString,
  Verb: HttpVerbSchema,
  Body: Schema.optional(Schema.Unknown),
});

export const BatchRequestSchema = Schema.Struct({
  Requests: Schema.Array(BatchRequestItemSchema),
});

export const BatchResponseItemSchema = withExtraKeys(
  Schema.Struct({
    RequestId: Schema.Int,
    ResponseCode: Schema.Int,
    ResponseBody: Schema.optional(Schema.Unknown),
  }),
);

export const BatchResponseSchema = withExtraKeys(
  Schema.Struct({
    Responses: Schema.optional(Schema.Array(BatchResponseItemSchema)),
  }),
);

// ── Info ────────────────────────────────────────────────────────────────

export const RouteInfoSchema = withExtraKeys(
  Schema.Struct({
    Path: Schema.optional(Schema.String),
    Verb: Schema.optional(Schema.String),
    Description: Schema.optional(Schema.String),
  }),
);

export const InfoResponseSchema = withExtraKeys(
  Schema.Struct({
    HttpRoutes: Schema.optional(Schema.Array(RouteInfoSchema)),
    Routes: Schema.optional(Schema.Array(RouteInfoSchema)),
  }),
);

// ── Events ──────────────────────────────────────────────────────────────

export const ObjectEventRequestSchema = Schema.Struct({
  objectPath: Schema.NonEmptyString,
  propertyName: Schema.optional(Schema.NonEmptyString),
  timeoutSeconds: Schema.optional(Schema.Finite.check(Schema.isGreaterThan(0))),
});

export const ObjectEventResponseSchema = withExtraKeys(
  Schema.Struct({
    objectPath: Schema.optional(Schema.String),
    propertyName: Schema.optional(Schema.String),
    propertyValue: Schema.optional(Schema.Unknown),
  }),
);

// ── Thumbnail ───────────────────────────────────────────────────────────

export const ObjectThumbnailRequestSchema = Schema.Struct({
  objectPath: Schema.NonEmptyString,
});

export const ObjectThumbnailResponseSchema = Schema.Unknown;
