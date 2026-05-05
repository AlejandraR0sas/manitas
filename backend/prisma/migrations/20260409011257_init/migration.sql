-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('USUARIO', 'ADMIN');

-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO');

-- CreateEnum
CREATE TYPE "TipoLeccion" AS ENUM ('TEORIA', 'PRACTICA', 'CAMARA');

-- CreateEnum
CREATE TYPE "TipoEjercicio" AS ENUM ('OPCION_MULTIPLE', 'VERDADERO_FALSO', 'CAMARA');

-- CreateEnum
CREATE TYPE "Periodo" AS ENUM ('SEMANAL', 'GLOBAL');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'USUARIO',
    "puntosTotales" INTEGER NOT NULL DEFAULT 0,
    "rachaActual" INTEGER NOT NULL DEFAULT 0,
    "rachaMaxima" INTEGER NOT NULL DEFAULT 0,
    "ultimaSesion" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "nivel" "Nivel" NOT NULL,
    "orden" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leccion" (
    "id" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "TipoLeccion" NOT NULL,
    "orden" INTEGER NOT NULL,
    "puntosRecompensa" INTEGER NOT NULL DEFAULT 10,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Leccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ejercicio" (
    "id" TEXT NOT NULL,
    "leccionId" TEXT NOT NULL,
    "pregunta" TEXT NOT NULL,
    "tipo" "TipoEjercicio" NOT NULL,
    "respuestaCorrecta" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgresoUsuario" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "leccionId" TEXT NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "completadoEn" TIMESTAMP(3),

    CONSTRAINT "ProgresoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Racha" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Racha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "periodo" "Periodo" NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProgresoUsuario_usuarioId_leccionId_key" ON "ProgresoUsuario"("usuarioId", "leccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Racha_usuarioId_fecha_key" ON "Racha"("usuarioId", "fecha");

-- AddForeignKey
ALTER TABLE "Leccion" ADD CONSTRAINT "Leccion_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejercicio" ADD CONSTRAINT "Ejercicio_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "Leccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoUsuario" ADD CONSTRAINT "ProgresoUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoUsuario" ADD CONSTRAINT "ProgresoUsuario_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "Leccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Racha" ADD CONSTRAINT "Racha_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
