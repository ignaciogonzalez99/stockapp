-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RUT', 'CI');

-- DropForeignKey
ALTER TABLE "Reparacion" DROP CONSTRAINT "Reparacion_vehiculoId_fkey";

-- DropForeignKey
ALTER TABLE "ReparacionHistory" DROP CONSTRAINT "ReparacionHistory_reparacionId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_productId_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_clientId_fkey";

-- DropIndex
DROP INDEX "Cliente_email_idx";

-- DropIndex
DROP INDEX "Cliente_email_key";

-- DropIndex
DROP INDEX "Product_sku_idx";

-- DropIndex
DROP INDEX "Product_sku_key";

-- DropIndex
DROP INDEX "Reparacion_code_idx";

-- DropIndex
DROP INDEX "ReparacionHistory_reparacionId_idx";

-- DropIndex
DROP INDEX "Vehiculo_plate_idx";

-- DropIndex
DROP INDEX "Vehiculo_plate_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "normalizedName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "docNumber" TEXT NOT NULL,
ADD COLUMN     "docType" "DocumentType" NOT NULL,
ADD COLUMN     "normalizedDocNumber" TEXT NOT NULL,
ADD COLUMN     "normalizedEmail" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "address" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "provider",
ADD COLUMN     "normalizedSku" TEXT NOT NULL,
ADD COLUMN     "providerId" INTEGER,
ALTER COLUMN "brand" SET DEFAULT '',
ALTER COLUMN "model" SET DEFAULT '',
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Reparacion" ADD COLUMN     "clienteId" INTEGER,
ADD COLUMN     "clienteSnapshot" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "identificativo" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehiculoSnapshot" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "status" SET DEFAULT 'SIN_INICIAR',
ALTER COLUMN "priority" SET DEFAULT 'NORMAL',
ALTER COLUMN "fechaIngreso" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "vehiculoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "reason" TEXT NOT NULL DEFAULT 'MANUAL';

-- AlterTable
ALTER TABLE "Vehiculo" DROP COLUMN "color",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "normalizedPlate" TEXT,
ADD COLUMN     "normalizedVin" TEXT,
ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "plate" DROP NOT NULL,
ALTER COLUMN "model" SET DEFAULT '',
ALTER COLUMN "vin" DROP NOT NULL,
ALTER COLUMN "clientId" DROP NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "normalizedRut" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "phone2" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReparacionInsumo" (
    "id" SERIAL NOT NULL,
    "reparacionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productSnapshot" TEXT NOT NULL,
    "skuSnapshot" TEXT NOT NULL,
    "measureSnapshot" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "extra" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReparacionInsumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReparacionManoObra" (
    "id" SERIAL NOT NULL,
    "reparacionId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReparacionManoObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "normalizedUsername" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_normalizedRut_key" ON "Proveedor"("normalizedRut");

-- CreateIndex
CREATE INDEX "Proveedor_name_idx" ON "Proveedor"("name");

-- CreateIndex
CREATE INDEX "ReparacionInsumo_reparacionId_createdAt_idx" ON "ReparacionInsumo"("reparacionId", "createdAt");

-- CreateIndex
CREATE INDEX "ReparacionInsumo_productId_idx" ON "ReparacionInsumo"("productId");

-- CreateIndex
CREATE INDEX "ReparacionManoObra_reparacionId_createdAt_idx" ON "ReparacionManoObra"("reparacionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_normalizedUsername_key" ON "User"("normalizedUsername");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Category_type_normalizedName_key" ON "Category"("type", "normalizedName");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_normalizedEmail_key" ON "Cliente"("normalizedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_docType_normalizedDocNumber_key" ON "Cliente"("docType", "normalizedDocNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Product_normalizedSku_key" ON "Product"("normalizedSku");

-- CreateIndex
CREATE INDEX "Product_providerId_idx" ON "Product"("providerId");

-- CreateIndex
CREATE INDEX "Product_normalizedSku_idx" ON "Product"("normalizedSku");

-- CreateIndex
CREATE INDEX "Reparacion_clienteId_idx" ON "Reparacion"("clienteId");

-- CreateIndex
CREATE INDEX "Reparacion_priority_idx" ON "Reparacion"("priority");

-- CreateIndex
CREATE INDEX "ReparacionHistory_reparacionId_changedAt_idx" ON "ReparacionHistory"("reparacionId", "changedAt");

-- CreateIndex
CREATE INDEX "StockMovement_productId_createdAt_idx" ON "StockMovement"("productId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_normalizedPlate_key" ON "Vehiculo"("normalizedPlate");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_normalizedVin_key" ON "Vehiculo"("normalizedVin");

-- CreateIndex
CREATE INDEX "Vehiculo_year_idx" ON "Vehiculo"("year");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReparacionHistory" ADD CONSTRAINT "ReparacionHistory_reparacionId_fkey" FOREIGN KEY ("reparacionId") REFERENCES "Reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReparacionInsumo" ADD CONSTRAINT "ReparacionInsumo_reparacionId_fkey" FOREIGN KEY ("reparacionId") REFERENCES "Reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReparacionInsumo" ADD CONSTRAINT "ReparacionInsumo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReparacionManoObra" ADD CONSTRAINT "ReparacionManoObra_reparacionId_fkey" FOREIGN KEY ("reparacionId") REFERENCES "Reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
