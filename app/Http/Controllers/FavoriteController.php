<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Place;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorite places.
     */
    public function index()
    {
        $favorites = Auth::user()->favorites()->with('place.category')->get();
        return view('favorites.index', compact('favorites'));
    }

    /**
     * Toggle a place as favorite for the authenticated user.
     */
    public function toggle(Request $request, $placeId)
    {
        $user = Auth::user();
        $place = Place::findOrFail($placeId);
        
        $favorite = Favorite::where('user_id', $user->id)
            ->where('place_id', $placeId)
            ->first();
            
        if ($favorite) {
            // If it exists, remove it
            $favorite->delete();
            $message = 'Lugar eliminado de favoritos';
            $isFavorite = false;
        } else {
            // If it doesn't exist, add it
            Favorite::create([
                'user_id' => $user->id,
                'place_id' => $placeId
            ]);
            $message = 'Lugar añadido a favoritos';
            $isFavorite = true;
        }
        
        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'isFavorite' => $isFavorite
            ]);
        }
        
        return redirect()->back()->with('success', $message);
    }

    /**
     * Check if a place is a favorite for the authenticated user.
     */
    public function isFavorite($placeId)
    {
        if (!Auth::check()) {
            return response()->json(['isFavorite' => false]);
        }
        
        $isFavorite = Favorite::where('user_id', Auth::id())
            ->where('place_id', $placeId)
            ->exists();
            
        return response()->json(['isFavorite' => $isFavorite]);
    }

    /**
     * Get all favorite places for the authenticated user.
     */
    public function getFavorites()
    {
        if (!Auth::check()) {
            return response()->json(['favorites' => []]);
        }
        
        $favorites = Auth::user()->favorites()->with('place.category')->get();
        $places = $favorites->map(function ($favorite) {
            return $favorite->place;
        });
        
        return response()->json(['favorites' => $places]);
    }
}
