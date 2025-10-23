<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\Achievement
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property string|null $icon_url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement query()
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement whereIconUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Achievement whereUpdatedAt($value)
 */
	class Achievement extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CalendarEvent
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $description
 * @property string|null $location
 * @property \Illuminate\Support\Carbon $start_at
 * @property \Illuminate\Support\Carbon|null $end_at
 * @property string $category
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent query()
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereEndAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereStartAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CalendarEvent whereUserId($value)
 */
	class CalendarEvent extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Favorite
 *
 * @property int $user_id
 * @property int $recipe_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property-read \App\Models\Recipe|null $recipe
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Favorite newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Favorite newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Favorite query()
 * @method static \Illuminate\Database\Eloquent\Builder|Favorite whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Favorite whereRecipeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Favorite whereUserId($value)
 */
	class Favorite extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Ingredient
 *
 * @property int $id
 * @property string $name
 * @property float $serving_size
 * @property string $serving_unit
 * @property float $calories
 * @property float $protein
 * @property float $carbs
 * @property float $fat
 * @property bool $is_verified
 * @property int|null $created_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $creator
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Recipe> $recipes
 * @property-read int|null $recipes_count
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient query()
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereCalories($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereCarbs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereFat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereIsVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereProtein($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereServingSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereServingUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Ingredient whereUpdatedAt($value)
 */
	class Ingredient extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\MealDetail
 *
 * @property int $id
 * @property int $meal_log_id
 * @property string $meal_type
 * @property int|null $ingredient_id
 * @property int|null $recipe_id
 * @property float|null $servings
 * @property float|null $grams
 * @property float $calories
 * @property float $protein
 * @property float $carbs
 * @property float $fat
 * @property string|null $logged_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Ingredient|null $ingredient
 * @property-read \App\Models\MealLog|null $log
 * @property-read \App\Models\Recipe|null $recipe
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereCalories($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereCarbs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereFat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereGrams($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereIngredientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereLoggedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereMealLogId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereMealType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereProtein($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereRecipeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereServings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealDetail whereUpdatedAt($value)
 */
	class MealDetail extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\MealLog
 *
 * @property int $id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon $log_date
 * @property float $total_calories
 * @property float $total_protein
 * @property float $total_carbs
 * @property float $total_fat
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MealDetail> $details
 * @property-read int|null $details_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereLogDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereTotalCalories($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereTotalCarbs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereTotalFat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereTotalProtein($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MealLog whereUserId($value)
 */
	class MealLog extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Message
 *
 * @property int $id
 * @property int $sender_id
 * @property int $receiver_id
 * @property string $body
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $receiver
 * @property-read \App\Models\User|null $sender
 * @method static \Illuminate\Database\Eloquent\Builder|Message newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Message newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Message query()
 * @method static \Illuminate\Database\Eloquent\Builder|Message whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Message whereReadAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Message whereReceiverId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Message whereSenderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Message whereUpdatedAt($value)
 */
	class Message extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Recipe
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $slug
 * @property string|null $description
 * @property string|null $steps
 * @property string $visibility
 * @property int $servings
 * @property int $prep_time_minutes
 * @property int $cook_time_minutes
 * @property string|null $image_disk
 * @property string|null $image_path
 * @property string|null $image_thumb_path
 * @property string|null $image_webp_path
 * @property int|null $image_width
 * @property int|null $image_height
 * @property float $calories
 * @property float $protein
 * @property float $carbs
 * @property float $fat
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $favoredBy
 * @property-read int|null $favored_by_count
 * @property-read string|null $image_thumb_url
 * @property-read string|null $image_url
 * @property-read string|null $image_webp_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Ingredient> $ingredients
 * @property-read int|null $ingredients_count
 * @property-read \App\Models\User|null $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $voters
 * @property-read int|null $voters_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Vote> $votes
 * @property-read int|null $votes_count
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe private()
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe public()
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe query()
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe unlisted()
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereCalories($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereCarbs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereCookTimeMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereFat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereImageDisk($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereImageHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereImageThumbPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereImageWebpPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereImageWidth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe wherePrepTimeMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereProtein($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereServings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereSteps($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe whereVisibility($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Recipe withIsFavorited(?int $userId)
 */
	class Recipe extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\RecipeIngredient
 *
 * @property int $id
 * @property int $recipe_id
 * @property int $ingredient_id
 * @property string $quantity
 * @property string $unit
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Ingredient|null $ingredient
 * @property-read \App\Models\Recipe|null $recipe
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient query()
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient whereIngredientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient whereRecipeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient whereUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RecipeIngredient whereUpdatedAt($value)
 */
	class RecipeIngredient extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $role
 * @property string|null $profile_picture
 * @property int|null $age
 * @property float|null $weight
 * @property float|null $height
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Achievement> $achievements
 * @property-read int|null $achievements_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CalendarEvent> $calendarEvents
 * @property-read int|null $calendar_events_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Recipe> $favorites
 * @property-read int|null $favorites_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MealLog> $mealLogs
 * @property-read int|null $meal_logs_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messagesReceived
 * @property-read int|null $messages_received_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messagesSent
 * @property-read int|null $messages_sent_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Recipe> $recipes
 * @property-read int|null $recipes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Vote> $votes
 * @property-read int|null $votes_count
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereAge($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereHeight($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereProfilePicture($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereWeight($value)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Vote
 *
 * @property int $id
 * @property int $user_id
 * @property int $recipe_id
 * @property int $rating
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Recipe|null $recipe
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder|Vote newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Vote newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Vote query()
 * @method static \Illuminate\Database\Eloquent\Builder|Vote whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vote whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vote whereRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vote whereRecipeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vote whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vote whereUserId($value)
 */
	class Vote extends \Eloquent {}
}

