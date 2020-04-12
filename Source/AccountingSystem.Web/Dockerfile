#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM atkseegow/dotnet:latest
COPY ["./bin/Release/netcoreapp2.1/linux-x64/publish", "/app"]
WORKDIR "/app/wwwroot/app"
RUN npm install
EXPOSE 80
EXPOSE 443
WORKDIR /app
ENTRYPOINT ["dotnet", "AccountingSystem.Web.dll"]