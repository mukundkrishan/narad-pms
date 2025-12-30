<?php

namespace App\Http\Controllers;

use App\Models\Corporate;
use App\Traits\ApiResponse;

class CorporateController extends Controller
{
    use ApiResponse;

    public function getByCode($organizationCode)
    {
        $corporate = Corporate::where('organization_code', $organizationCode)->first();

        if (!$corporate) {
            return $this->errorResponse('No organization exists', 404);
        }

        if ($corporate->deleted_at) {
            return $this->errorResponse('No organization exists', 404);
        }

        if ($corporate->status !== 'active') {
            return $this->errorResponse('Please contact admin', 403);
        }

        return $this->successResponse([
            'name' => $corporate->name,
            'organization_code' => $corporate->organization_code,
            'status' => $corporate->status
        ]);
    }
}