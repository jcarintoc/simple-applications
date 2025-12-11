import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, RefreshCw, Save, Check, KeyRound, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useGeneratePassword, useSavePassword, useUser } from "@/lib/query";
import { generatePasswordSchema, type GeneratePasswordInput } from "@/lib/api/types";

export function PasswordGenerator() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveLabel, setSaveLabel] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  const { data: userData } = useUser();
  const generateMutation = useGeneratePassword();
  const saveMutation = useSavePassword();

  const form = useForm<GeneratePasswordInput>({
    resolver: zodResolver(generatePasswordSchema),
    defaultValues: {
      length: 16,
      hasUppercase: true,
      hasLowercase: true,
      hasNumbers: true,
      hasSymbols: false,
    },
  });

  const options = form.watch();

  const handleGenerate = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const values = form.getValues();
    try {
      const password = await generateMutation.mutateAsync(values);
      setGeneratedPassword(password);
      setCopied(false);
      setShowSaveInput(false);
    } catch (error) {
      console.error("Failed to generate password:", error);
    }
  }, [form, generateMutation]);

  const handleCopy = useCallback(async () => {
    if (!generatedPassword) return;
    await navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedPassword]);

  const handleSave = useCallback(async () => {
    if (!generatedPassword) return;
    
    try {
      await saveMutation.mutateAsync({
        password: generatedPassword,
        label: saveLabel || undefined,
        ...options,
      });
      setShowSaveInput(false);
      setSaveLabel("");
    } catch (error) {
      console.error("Failed to save password:", error);
    }
  }, [generatedPassword, saveLabel, options, saveMutation]);

  const getPasswordStrength = useCallback((password: string) => {
    if (!password) return { label: "", color: "", width: "0%" };
    
    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (score <= 4) return { label: "Medium", color: "bg-yellow-500", width: "50%" };
    if (score <= 5) return { label: "Strong", color: "bg-emerald-500", width: "75%" };
    return { label: "Very Strong", color: "bg-emerald-600", width: "100%" };
  }, []);

  const strength = getPasswordStrength(generatedPassword);
  const isAuthenticated = !!userData?.user;

  return (
    <Card className="lg:sticky lg:top-28 border-2 border-dashed border-primary/20 bg-gradient-to-br from-card to-card/50 h-fit">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Password Generator</CardTitle>
            <CardDescription>Generate secure random passwords</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generated Password Display */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              readOnly
              value={generatedPassword}
              placeholder="Click generate to create a password"
              className="pr-24 font-mono text-lg tracking-wider h-14 bg-muted/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={!generatedPassword}
                className="h-9 w-9"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="h-9 w-9"
              >
                <RefreshCw className={`h-4 w-4 ${generateMutation.isPending ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
          
          {/* Strength Indicator */}
          {generatedPassword && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Strength: <span className="font-medium">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        <Form {...form}>
          <form className="space-y-6">
            {/* Length Slider */}
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password Length</FormLabel>
                    <span className="text-2xl font-bold tabular-nums text-primary">
                      {field.value}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      min={4}
                      max={64}
                      step={1}
                      className="py-2"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4</span>
                    <span>64</span>
                  </div>
                </FormItem>
              )}
            />

            {/* Character Options */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Character Types</Label>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hasUppercase"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3 bg-background/50">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Uppercase</Label>
                        <p className="text-xs text-muted-foreground">A-Z</p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasLowercase"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3 bg-background/50">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Lowercase</Label>
                        <p className="text-xs text-muted-foreground">a-z</p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasNumbers"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3 bg-background/50">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Numbers</Label>
                        <p className="text-xs text-muted-foreground">0-9</p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasSymbols"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3 bg-background/50">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Symbols</Label>
                        <p className="text-xs text-muted-foreground">!@#$%</p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            size="lg"
            className="w-full"
          >
            {generateMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate Password
              </>
            )}
          </Button>

          {generatedPassword && isAuthenticated && !showSaveInput && (
            <Button
              variant="outline"
              onClick={() => setShowSaveInput(true)}
              className="w-full"
            >
              <Save className="h-4 w-4" />
              Save Password
            </Button>
          )}

          {showSaveInput && (
            <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
              <Input
                placeholder="Label (optional) - e.g., Gmail, Netflix"
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="flex-1"
                >
                  {saveMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowSaveInput(false);
                    setSaveLabel("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!isAuthenticated && generatedPassword && (
            <p className="text-center text-sm text-muted-foreground">
              <a href="/login" className="text-primary hover:underline">Sign in</a> to save your passwords
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

