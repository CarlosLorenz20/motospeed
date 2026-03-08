<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * POST /api/auth/login
     * Devuelve un JWT válido o error 401.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['message' => 'Credenciales incorrectas.'], 401);
            }
        } catch (JWTException) {
            return response()->json(['message' => 'No se pudo generar el token.'], 500);
        }

        return $this->respondWithToken($token);
    }

    /**
     * POST /api/auth/refresh
     * Renueva el token antes de su expiración.
     */
    public function refresh(): JsonResponse
    {
        try {
            $token = JWTAuth::parseToken()->refresh();
        } catch (JWTException) {
            return response()->json(['message' => 'Token inválido o expirado.'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * POST /api/auth/logout
     * Invalida el token actual (blacklist).
     */
    public function logout(): JsonResponse
    {
        JWTAuth::parseToken()->invalidate();
        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    /**
     * GET /api/auth/me
     * Devuelve el usuario autenticado.
     */
    public function me(): JsonResponse
    {
        $user = JWTAuth::parseToken()->authenticate();
        return response()->json($user);
    }

    // ─── Helper ─────────────────────────────────────────────────────────────
    private function respondWithToken(string $token): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
        ]);
    }
}
