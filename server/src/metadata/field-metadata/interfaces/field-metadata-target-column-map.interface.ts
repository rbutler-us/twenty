import { FieldMetadataType } from 'src/metadata/field-metadata/field-metadata.entity';

export interface FieldMetadataTargetColumnMapValue {
  value: string;
}

export interface FieldMetadataTargetColumnMapUrl {
  text: string;
  link: string;
}

export interface FieldMetadataTargetColumnMapMoney {
  value: number;
  currency: string;
}

type AllFieldMetadataTypes =
  | FieldMetadataTargetColumnMapValue
  | FieldMetadataTargetColumnMapUrl
  | FieldMetadataTargetColumnMapMoney;

type FieldMetadataTypeMapping = {
  [FieldMetadataType.URL]: FieldMetadataTargetColumnMapUrl;
  [FieldMetadataType.MONEY]: FieldMetadataTargetColumnMapMoney;
};

type TypeByFieldMetadata<T extends FieldMetadataType | 'default'> =
  T extends keyof FieldMetadataTypeMapping
    ? FieldMetadataTypeMapping[T]
    : T extends 'default'
    ? AllFieldMetadataTypes
    : FieldMetadataTargetColumnMapValue;

export type FieldMetadataTargetColumnMap<
  T extends FieldMetadataType | 'default' = 'default',
> = TypeByFieldMetadata<T>;
