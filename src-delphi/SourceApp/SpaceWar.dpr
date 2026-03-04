program SpaceWar;

{$R 'MainResource.res' 'MainResource.rc'}

uses
  Forms,
  FormMain in 'FormMain.pas' {MainForm},
  CUFont in '..\SourceEngine\CUFont.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.Title := 'Space War';
  Application.CreateForm(TMainForm, MainForm);
  Application.Run;
end.
