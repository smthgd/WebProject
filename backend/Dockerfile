FROM mcr.microsoft.com/dotnet/sdk:9.0 AS base

WORKDIR /usr/src/app
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /usr/src/app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /usr/src/app

# Install curl in the final image
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=base /usr/src/app/publish .
CMD ["dotnet", "backend.dll"]
