#Checks if the required packages are installed. If not, install the packages listed

packages <- c("ROAuth","streamR","tm","SnowballC","wordcloud","devtools","ff","rmongodb","plyr",'Rstem','sentiment','RMOA')
pathToRStem <-"installer_libraries/Rstem_0.4-1.tar"
library("devtools")
for(pkg in packages){
  if(!is.element(pkg, installed.packages()[,1]))
  {
    install.packages(pkg, repos="http://cran.fhcrc.org")
   if(pkg=='Rstem')
     install.packages(pathToRStem, repos = NULL, type="source")
   if(pkg=='sentiment')
     install_url("http://cran.r-project.org/src/contrib/Archive/sentiment/sentiment_0.2.tar.gz")
  } else {print(paste(pkg, " library already installed"))}
}

## To install RMOA : Uncomment if not installed
# install_github("jwijffels/RMOA", subdir="RMOAjars/pkg")
# install_github("jwijffels/RMOA", subdir="RMOA/pkg")