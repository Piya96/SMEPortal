#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/SME.Portal.Web.Public/SME.Portal.Web.Public.csproj", "src/SME.Portal.Web.Public/"]
COPY ["src/SME.Portal.Web.Core/SME.Portal.Web.Core.csproj", "src/SME.Portal.Web.Core/"]
COPY ["src/SME.Portal.Application/SME.Portal.Application.csproj", "src/SME.Portal.Application/"]
COPY ["src/SME.Portal.Application.Shared/SME.Portal.Application.Shared.csproj", "src/SME.Portal.Application.Shared/"]
COPY ["src/SME.Portal.Core.Shared/SME.Portal.Core.Shared.csproj", "src/SME.Portal.Core.Shared/"]
COPY ["src/SME.Portal.Core/SME.Portal.Core.csproj", "src/SME.Portal.Core/"]
COPY ["src/SME.Portal.EntityFrameworkCore/SME.Portal.EntityFrameworkCore.csproj", "src/SME.Portal.EntityFrameworkCore/"]
COPY ["src/SME.Portal.GraphQL/SME.Portal.GraphQL.csproj", "src/SME.Portal.GraphQL/"]
RUN dotnet restore "src/SME.Portal.Web.Public/SME.Portal.Web.Public.csproj"
COPY . .
WORKDIR "/src/src/SME.Portal.Web.Public"
RUN dotnet build "SME.Portal.Web.Public.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SME.Portal.Web.Public.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SME.Portal.Web.Public.dll"]
