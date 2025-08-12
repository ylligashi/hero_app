import { login } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function LoginPage({ searchParams }: { searchParams: { redirect?: string; error?: string } }) {
  const redirectTo = searchParams?.redirect || '/';
  const error = searchParams?.error ? decodeURIComponent(searchParams.error) : '';

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="mb-3 text-sm text-red-600">{error}</p>
          ) : null}
          <form action={login} method="post" className="grid gap-3">
            <input type="hidden" name="redirect" value={redirectTo} />
            <div className="grid gap-1">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" name="email" type="email" required placeholder="admin@example.com" />
            </div>
            <div className="grid gap-1">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="mt-2">Sign in</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
