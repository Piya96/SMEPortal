#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/SME.Portal.Migrator/SME.Portal.Migrator.csproj", "src/SME.Portal.Migrator/"]
COPY ["src/SME.Portal.EntityFrameworkCore/SME.Portal.EntityFrameworkCore.csproj", "src/SME.Portal.EntityFrameworkCore/"]
COPY ["src/SME.Portal.Core/SME.Portal.Core.csproj", "src/SME.Portal.Core/"]
COPY ["src/SME.Portal.Core.Shared/SME.Portal.Core.Shared.csproj", "src/SME.Portal.Core.Shared/"]
RUN dotnet restore "src/SME.Portal.Migrator/SME.Portal.Migrator.csproj"
COPY . .
WORKDIR "/src/src/SME.Portal.Migrator"
RUN dotnet build "SME.Portal.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SME.Portal.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SME.Portal.Migrator.dll"]
