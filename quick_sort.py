def quick_sort(arr):
    """Return a new list sorted in ascending order using quick sort."""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)


if __name__ == "__main__":
    numbers = [8, 3, 1, 7, 0, 10, 2]
    sorted_numbers = quick_sort(numbers)

    print("原始列表:", numbers)
    print("排序结果:", sorted_numbers)
