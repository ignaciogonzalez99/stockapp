-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('PRODUCT', 'VEHICLE');

-- CreateEnum
CREATE TYPE "ReparacionStatus" AS ENUM ('SIN_INICIAR', 'EN_CURSO', 'PAUSADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "ReparacionPriority" AS ENUM ('BAJA', 'NORMAL', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT');

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "measure" TEXT NOT NULL DEFAULT 'Unidades',
    "currency" TEXT NOT NULL DEFAULT '$U',
    "costPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sellPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "brand" TEXT,
    "model" TEXT,
    "provider" TEXT,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "categoryId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "type" "MovementType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reparacion" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReparacionStatus" NOT NULL,
    "priority" "ReparacionPriority" NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "vehiculoId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Reparacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReparacionHistory" (
    "id" SERIAL NOT NULL,
    "reparacionId" INTEGER NOT NULL,
    "status" "ReparacionStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReparacionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_type_idx" ON "Category"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_sku_idx" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE INDEX "Cliente_name_idx" ON "Cliente"("name");

-- CreateIndex
CREATE INDEX "Cliente_email_idx" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_plate_key" ON "Vehiculo"("plate");

-- CreateIndex
CREATE INDEX "Vehiculo_clientId_idx" ON "Vehiculo"("clientId");

-- CreateIndex
CREATE INDEX "Vehiculo_categoryId_idx" ON "Vehiculo"("categoryId");

-- CreateIndex
CREATE INDEX "Vehiculo_plate_idx" ON "Vehiculo"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "Reparacion_code_key" ON "Reparacion"("code");

-- CreateIndex
CREATE INDEX "Reparacion_vehiculoId_idx" ON "Reparacion"("vehiculoId");

-- CreateIndex
CREATE INDEX "Reparacion_status_idx" ON "Reparacion"("status");

-- CreateIndex
CREATE INDEX "Reparacion_code_idx" ON "Reparacion"("code");

-- CreateIndex
CREATE INDEX "ReparacionHistory_reparacionId_idx" ON "ReparacionHistory"("reparacionId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReparacionHistory" ADD CONSTRAINT "ReparacionHistory_reparacionId_fkey" FOREIGN KEY ("reparacionId") REFERENCES "Reparacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
