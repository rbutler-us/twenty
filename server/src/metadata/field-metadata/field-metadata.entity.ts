import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {
  Authorize,
  BeforeCreateOne,
  IDField,
  QueryOptions,
} from '@ptc-org/nestjs-query-graphql';

import { ObjectMetadata } from 'src/metadata/object-metadata/object-metadata.entity';
import { IFieldMetadata } from 'src/tenant/schema-builder/metadata/field.metadata';

import { BeforeCreateOneField } from './hooks/before-create-one-field.hook';
import { FieldMetadataTargetColumnMap } from './interfaces/field-metadata-target-column-map.interface';

export enum FieldMetadataType {
  UUID = 'UUID',
  TEXT = 'TEXT',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
  ENUM = 'ENUM',
  URL = 'URL',
  MONEY = 'MONEY',
}

registerEnumType(FieldMetadataType, {
  name: 'FieldMetadataType',
  description: 'Type of the field',
});

@Entity('field_metadata')
@ObjectType('field')
@BeforeCreateOne(BeforeCreateOneField)
@Authorize({
  authorize: (context: any) => ({
    workspaceId: { eq: context?.req?.user?.workspace?.id },
  }),
})
@QueryOptions({
  defaultResultSize: 10,
  maxResultsSize: 100,
  disableFilter: true,
  disableSort: true,
})
@Unique('IndexOnNameAndWorkspaceIdUnique', ['name', 'objectId', 'workspaceId'])
export class FieldMetadata implements IFieldMetadata {
  @IDField(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, name: 'object_id' })
  objectId: string;

  @Field(() => FieldMetadataType)
  @Column({ nullable: false })
  type: FieldMetadataType;

  @Field()
  @Column({ nullable: false })
  name: string;

  @Field()
  @Column({ nullable: false })
  label: string;

  @Column({ nullable: false, name: 'target_column_map', type: 'jsonb' })
  targetColumnMap: FieldMetadataTargetColumnMap;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'description', type: 'text' })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'icon' })
  icon: string;

  @Field({ nullable: true, deprecationReason: 'Use label name instead' })
  placeholder: string;

  @Column('text', { nullable: true, array: true })
  enums: string[];

  @Field()
  @Column({ default: false, name: 'is_custom' })
  isCustom: boolean;

  @Field()
  @Column({ default: false, name: 'is_active' })
  isActive: boolean;

  @Field()
  @Column({ nullable: true, default: true, name: 'is_nullable' })
  isNullable: boolean;

  @Column({ nullable: false, name: 'workspace_id' })
  workspaceId: string;

  @ManyToOne(() => ObjectMetadata, (object) => object.fields)
  @JoinColumn({ name: 'object_id' })
  object: ObjectMetadata;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
