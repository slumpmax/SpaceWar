unit XPKey;

interface

uses
  Windows;

type
  TXPKeyRecord = record
  private
    function FReadDown: Boolean;
    procedure FWriteDown(AValue: Boolean);
    function FReadStay: Boolean;
    procedure FWriteStay(AValue: Boolean);
  public
    Value: Byte;
    property Down: Boolean read FReadDown write FWriteDown;
    property Stay: Boolean read FReadStay write FWriteStay;
  end;
  
  TXPKey = class
  private
    function FReadValues(AKey: Word): Byte;
    procedure FWriteValues(AKey: Word; AValue: Byte);
  public
    Keys: array[Byte] of TXPKeyRecord;
    LastKey, LastKeyDown, LastKeyUp: Word;
    property Values[AKey: Word]: Byte read FReadValues write FWriteValues; default;
    constructor Create;
    procedure Clear;
    procedure Update(Key: Word; Down: Boolean);
    function Down(Key: Word): Boolean;
    function Press(Key: Word): Boolean;
    function PressOnce(Key: Word): Boolean;
    function Toggle(Key: Word): Boolean;
  end;

implementation

// TXPKeyRecord
function TXPKeyRecord.FReadDown: Boolean;
begin
  Result := (Value and 1) > 0;
end;

procedure TXPKeyRecord.FWriteDown(AValue: Boolean);
begin
  if AValue then
    Value := Value or 1
  else Value := Value and $FE;
end;

function TXPKeyRecord.FReadStay: Boolean;
begin
  Result := (Value and 2) > 0;
end;

procedure TXPKeyRecord.FWriteStay(AValue: Boolean);
begin
  if AValue then
    Value := Value or 2
  else Value := Value and $FD;
end;

// TXPKey
constructor TXPKey.Create;
begin
  Clear;
end;

function TXPKey.FReadValues(AKey: Word): Byte;
begin
  if (AKey < 256) then
    Result := Keys[AKey].Value
  else Result := 0;
end;

procedure TXPKey.FWriteValues(AKey: Word; AValue: Byte);
begin
  if (AKey < 256) then Keys[AKey].Value := AValue;
end;

procedure TXPKey.Clear;
var
  n: Word;
begin
  for n := Low(Keys) to High(Keys) do Keys[n].Value := 0;
  LastKey := 0;
  LastKeyDown := 0;
  LastKeyUp := 0;
end;

procedure TXPKey.Update(Key: Word; Down: Boolean);
begin
  if (Key < 256) then
  begin
    Keys[Key].Down := Down;
    LastKey := Key;
    if Down then
      LastKeyDown := Key
    else LastKeyUp := Key;
  end;
end;

function TXPKey.Down(Key: Word): Boolean;
begin
  if Key < 256 then with Keys[Key] do
  begin
    Result := Down;
    Stay := Down;
  end
  else Result := False;
end;

function TXPKey.Press(Key: Word): Boolean;
begin
  if Key < 256 then with Keys[Key] do
  begin
    Result := Down;
    Stay := Down;
    Down := False;
  end
  else Result := False;
end;

function TXPKey.PressOnce(Key: Word): Boolean;
begin
  if Key < 256 then with Keys[Key] do
  begin
    Result := Down and not Stay;
    Stay := Down;
  end
  else Result := False;
end;

function TXPKey.Toggle(Key: Word): Boolean;
begin
  if Key < 256 then with Keys[Key] do
  begin
    Result := Down xor Stay;
    Stay := Down;
  end
  else Result := False;
end;

end.
