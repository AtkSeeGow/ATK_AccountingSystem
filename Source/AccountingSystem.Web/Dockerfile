#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM mcr.microsoft.com/dotnet/sdk:6.0
COPY ["./bin/Release/netcoreapp2.1/linux-x64/publish", "/app"]
EXPOSE 5000
EXPOSE 5001
WORKDIR /app
ENTRYPOINT ["dotnet", "AccountingSystem.Web.dll"]