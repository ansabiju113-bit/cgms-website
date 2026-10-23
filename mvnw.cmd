@REM Maven Wrapper for Jan-Suraksha Spring Boot
@echo off
setlocal
set MAVEN_CMD=mvn
if defined MAVEN_HOME (
    set MAVEN_CMD="%MAVEN_HOME%\bin\mvn"
)
%MAVEN_CMD% %*
